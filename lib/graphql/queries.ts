import { gql } from "@apollo/client";

export const REGISTER = gql`
  mutation Register($input: CreateUserInput!) {
    register(input: $input) {
      user {
        _id
        email
        nickname
        avatarUrl
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
      avatarUrl
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
      ownerId
      isPublic
      status
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
      ownerId
      isPublic
      status
      participants {
        userId
        nickname
        role
        status
      }
      currentWheelId
    }
  }
`;

export const GET_ROOM = gql`
  query GetRoom($roomId: String!) {
    room(roomId: $roomId) {
      _id
      code
      name
      ownerId
      isPublic
      status
      participants {
        userId
        nickname
        role
        status
      }
      currentWheelId
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
        _id
        text
        color
        weight
        order
        iconUrl
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
        _id
        text
        color
        weight
        order
        iconUrl
      }
      updatedAt
    }
  }
`;

export const GET_WHEEL = gql`
  query GetWheel($wheelId: String!) {
    wheel(wheelId: $wheelId) {
      _id
      roomId
      title
      segments {
        _id
        text
        color
        weight
        order
        iconUrl
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
      winnerId
      winner {
        text
        color
      }
      seed
      spinnerNickname
      timestamp
    }
  }
`;

export const GET_STATISTICS = gql`
  query GetStatistics($roomId: String!, $wheelId: String) {
    statistics(roomId: $roomId, wheelId: $wheelId) {
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
