import { Apartment } from '@app/definitions';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

// ...ParamList is the list of all the screens in the navigator
// and the types of the props used by the screen
// EX: const Navigator = createStackNavigator<AuthNavigatorParamList>();
//
// ...ScreenProps is a short-hand to annotate quickly the props when declaring a screen
// EX: export default function WelcomeScreen({ route, navigation }: AuthNavigatorScreenProps<'Welcome'>)

// =================== Auth navigator ===================
// ------- Auth stack -------
export type AuthStackParamList = {
  Welcome: undefined;
  Login: {
    navigateFromRegister?: boolean;
  };
  RegisterStack: NavigatorScreenParams<RegisterStackParamList>;
};

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = StackScreenProps<
  AuthStackParamList,
  T
>;

// ------- Auth stack -------
export type RegisterStackParamList = {
  Email: undefined;
  UserInfo: undefined;
  Password: undefined;
  Successful: undefined;
};

export type RegisterStackScreenProps<T extends keyof RegisterStackParamList> = CompositeScreenProps<
  StackScreenProps<RegisterStackParamList, T>,
  AuthStackScreenProps<keyof AuthStackParamList>
>;

// =================== Inside navigator ===================
// ------- Bottom Tab stack -------
export type BottomTabStackParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList>;
  MessageStack: NavigatorScreenParams<MessageStackParamList>;
  LikesStack: NavigatorScreenParams<LikesStackParamList>;
  ColocFinderStack: NavigatorScreenParams<ColocFinderStackParamList>;
  ProfilStack: NavigatorScreenParams<ProfilStackParamList>;
};

export type BottomTabStackScreenProps<T extends keyof BottomTabStackParamList> =
  BottomTabScreenProps<BottomTabStackParamList, T>;

// ------- Home stack -------
export type HomeStackParamList = {
  Home: undefined;
  SharedStack: NavigatorScreenParams<SharedStackParamList>;
};

export type HomeStackScreenProps<T extends keyof HomeStackParamList> = CompositeScreenProps<
  StackScreenProps<HomeStackParamList, T>,
  BottomTabStackScreenProps<keyof BottomTabStackParamList>
>;

// ------- Message stack -------
export type MessageStackParamList = {
  DirectMessageList: undefined;
  DirectMessage: undefined;
  GroupMessageList: undefined;
  GroupMessage: undefined;
  SharedStack: NavigatorScreenParams<SharedStackParamList>;
};

export type MessageStackScreenProps<T extends keyof MessageStackParamList> = CompositeScreenProps<
  StackScreenProps<MessageStackParamList, T>,
  BottomTabStackScreenProps<keyof BottomTabStackParamList>
>;

// ------- Likes stack -------
export type LikesStackParamList = {
  LikesList: undefined;
  SharedStack: NavigatorScreenParams<SharedStackParamList>;
};

export type LikesStackScreenProps<T extends keyof LikesStackParamList> = CompositeScreenProps<
  StackScreenProps<LikesStackParamList, T>,
  BottomTabStackScreenProps<keyof BottomTabStackParamList>
>;

// ------- ColocFinder stack -------
export type ColocFinderStackParamList = {
  ColocFinder: undefined;
  ColocFinderForHouse: { houseId: number };
  SharedStack: NavigatorScreenParams<SharedStackParamList>;
};

export type ColocFinderStackScreenProps<T extends keyof ColocFinderStackParamList> =
  CompositeScreenProps<
    StackScreenProps<ColocFinderStackParamList, T>,
    BottomTabStackScreenProps<keyof BottomTabStackParamList>
  >;

// ------- Profil stack -------
export type ProfilStackParamList = {
  Profil: undefined;
  Settings: undefined;
  Filters: undefined;
  History: undefined;
  SharedStack: NavigatorScreenParams<SharedStackParamList>;
};

export type ProfilStackScreenProps<T extends keyof ProfilStackParamList> = CompositeScreenProps<
  StackScreenProps<ProfilStackParamList, T>,
  BottomTabStackScreenProps<keyof BottomTabStackParamList>
>;

// ------- Shared stack -------
export type SharedStackParamList = {
  ApartmentDetails: { apartment?: Apartment; apartmentId?: number };
  OtherProfil: { userId: number };
  DirectMessage: { userId: number };
};

export type SharedStackScreenProps<T extends keyof SharedStackParamList> = CompositeScreenProps<
  StackScreenProps<SharedStackParamList, T>,
  HomeStackScreenProps<keyof HomeStackParamList>
>;
