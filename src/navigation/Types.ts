import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { StackAnimationName, StackScreenProps } from '@react-navigation/stack';

import { ApartmentInfo } from '@app/definitions';

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
  Login: { navigateFromRegister?: boolean };
  RegisterEmail: undefined;
  RegisterPicture: undefined;
  RegisterUserInfo: undefined;
  RegisterPassword: undefined;
  VerifyEmail: { isNewlyRegistered: boolean };
};

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = StackScreenProps<
  AuthStackParamList,
  T
>;

// =================== Inside navigator ===================
// ------- Inside stack -------
export type InsideStackParamList = {
  BottomTabStack: NavigatorScreenParams<BottomTabStackParamList>;
  SharedStack: NavigatorScreenParams<SharedStackParamList> & {
    animation?: StackAnimationName;
  };
  ImageList: { images: string[] };
  ImageGallery: { images: string[]; index: number };
};

export type InsideStackScreenProps<T extends keyof InsideStackParamList> = StackScreenProps<
  InsideStackParamList,
  T
>;

// ------- Shared stack -------
export type SharedStackParamList = {
  ApartmentDetails: {
    apartment?: ApartmentInfo;
    apartmentId?: number;
    enableRelationButtons?: boolean;
  };
  OtherProfile: { userId: string };
  DirectMessage: { roomId: number | null };
};

export type SharedStackScreenProps<T extends keyof SharedStackParamList> = CompositeScreenProps<
  StackScreenProps<SharedStackParamList, T>,
  InsideStackScreenProps<keyof InsideStackParamList>
>;

// ------- Bottom Tab stack -------
export type BottomTabStackParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList>;
  MessageStack: NavigatorScreenParams<MessageStackParamList>;
  LikesStack: NavigatorScreenParams<LikesStackParamList>;
  ColocFinderStack: NavigatorScreenParams<ColocFinderStackParamList>;
  AccountStack: NavigatorScreenParams<AccountStackParamList>;
};

export type BottomTabStackScreenProps<T extends keyof BottomTabStackParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<BottomTabStackParamList, T>,
    InsideStackScreenProps<keyof InsideStackParamList>
  >;

// ------- Home stack -------
export type HomeStackParamList = {
  Home: undefined;
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
  GroupInfo: undefined;
  AddToARoom: { userId: string };
  SharedStack: NavigatorScreenParams<SharedStackParamList>;
};

export type MessageStackScreenProps<T extends keyof MessageStackParamList> = CompositeScreenProps<
  StackScreenProps<MessageStackParamList, T>,
  BottomTabStackScreenProps<keyof BottomTabStackParamList>
>;

// ------- Likes stack -------
export type LikesStackParamList = {
  LikesList: undefined;
};

export type LikesStackScreenProps<T extends keyof LikesStackParamList> = CompositeScreenProps<
  StackScreenProps<LikesStackParamList, T>,
  BottomTabStackScreenProps<keyof BottomTabStackParamList>
>;

// ------- ColocFinder stack -------
export type ColocFinderStackParamList = {
  ColocFinder: undefined;
  ColocFinderForHouse: { houseId: number };
};

export type ColocFinderStackScreenProps<T extends keyof ColocFinderStackParamList> =
  CompositeScreenProps<
    StackScreenProps<ColocFinderStackParamList, T>,
    BottomTabStackScreenProps<keyof BottomTabStackParamList>
  >;

// ------- Account stack -------
export type AccountStackParamList = {
  Account: undefined;
  MyProfile: undefined;
  Filters: undefined;
  History: undefined;
};

export type AccountStackScreenProps<T extends keyof AccountStackParamList> = CompositeScreenProps<
  StackScreenProps<AccountStackParamList, T>,
  BottomTabStackScreenProps<keyof BottomTabStackParamList>
>;
