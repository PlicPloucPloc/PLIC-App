import { ActivityIndicator, Modal, View } from 'react-native';

type LoaderProps = {
  loading: boolean;
};

export default function Loader(props: LoaderProps): JSX.Element | null {
  if (!props.loading) return null;

  return (
    <Modal transparent={true} animationType="none">
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          opacity: 0.6,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    </Modal>
  );
}
