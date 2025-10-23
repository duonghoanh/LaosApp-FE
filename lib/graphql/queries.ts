import { gql } from "@apollo/client";

export const REGISTER = gql`
  mutation Register($input: CreateUserInput!) {
    register(input: $input) {
      user {
        _id
        email
        nickname
        avatar
      }
      accessToken
    }
  }
`;

export const GET_ME = gql`
  query GetMe {
    me {
      _id
      email
      nickname
      avatar
      createdAt
    }
  }
`;

export const CREATE_ROOM = gql`
  mutation CreateRoom($input: CreateRoomInput!) {
    createRoom(input: $input) {
      _id
      code
      name
      hostId
      isPublic
      isActive
      participants {
        userId
        nickname
        role
        status
      }
      createdAt
    }
  }
`;

export const JOIN_ROOM = gql`
  mutation JoinRoom($input: JoinRoomInput!) {
    joinRoom(input: $input) {
      _id
      code
      name
      hostId
      isPublic
      isActive
      participants {
        userId
        nickname
        role
        status
      }
    }
  }
`;

export const GET_ROOM = gql`
  query GetRoom($id: ID!) {
    room(id: $id) {
      _id
      code
      name
      hostId
      isPublic
      isActive
      participants {
        userId
        nickname
        role
        status
      }
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_WHEEL = gql`
  mutation CreateWheel($input: CreateWheelInput!) {
    createWheel(input: $input) {
      _id
      roomId
      title
      segments {
        id
        text
        color
        weight
        order
        icon
      }
      createdAt
    }
  }
`;

export const UPDATE_WHEEL = gql`
  mutation UpdateWheel($input: UpdateWheelInput!) {
    updateWheel(input: $input) {
      _id
      roomId
      title
      segments {
        id
        text
        color
        weight
        order
        icon
      }
      updatedAt
    }
  }
`;

export const GET_WHEEL = gql`
  query GetWheel($id: ID!) {
    wheel(id: $id) {
      _id
      roomId
      title
      segments {
        id
        text
        color
        weight
        order
        icon
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_SPIN_HISTORY = gql`
  query GetSpinHistory($input: GetHistoryInput!) {
    spinHistory(input: $input) {
      _id
      roomId
      wheelId
      spinnerId
      spinnerNickname
      result
      segmentId
      seed
      rotation
      spunAt
    }
  }
`;

export const GET_STATISTICS = gql`
  query GetStatistics($roomId: ID!) {
    roomStatistics(roomId: $roomId) {
      totalSpins
      segmentStats {
        segmentId
        text
        count
        percentage
      }
    }
  }
`;
