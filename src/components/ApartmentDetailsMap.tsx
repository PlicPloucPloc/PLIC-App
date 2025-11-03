import { useEffect, useState } from 'react';
import { ActivityIndicator, ViewStyle } from 'react-native';

import MapView, { Circle, Marker, Region } from 'react-native-maps';

import { MAP_CIRCLE_RADIUS } from '@app/config/Constants';
import { Place } from '@app/definitions';
import { geocodeAddress, getNearbyStores, getNearbySubways } from '@app/rest/GoogleMapService';
import { Images } from '@assets/index';

const LATITUDE_DELTA = 0.025;
const LONGITUDE_DELTA = 0.025;

type MapProps = {
  address: string;
  style: ViewStyle;
};

export default function NearbyInfrastructureMap({ address, style }: MapProps) {
  const [region, setRegion] = useState<Region | null>(null);

  const [markers, setMarkers] = useState<Place[]>([]);

  useEffect(() => {
    (async () => {
      const { latitude, longitude } = await geocodeAddress(address);

      setRegion({
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
        latitude,
        longitude,
      });

      const stores = getNearbyStores(latitude, longitude);
      const subways = getNearbySubways(latitude, longitude);

      const places = await Promise.all([stores, subways])
        .then((res) => res.flat())
        .catch((err) => {
          console.error(err);
          return [];
        });
      setMarkers(places);
    })();
  }, [address]);

  if (!region) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <MapView style={style} region={region}>
      <Circle
        center={{ latitude: region.latitude, longitude: region.longitude }}
        radius={MAP_CIRCLE_RADIUS}
        strokeColor="rgba(0, 0, 255, 0.5)"
        fillColor="rgba(0, 0, 255, 0.1)"
      />
      {markers.map((marker, index) => (
        <Marker
          key={index}
          coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
          title={marker.name}
          image={marker.type == 'store' ? Images.storePin : Images.subwayPin}
        />
      ))}
    </MapView>
  );
}
