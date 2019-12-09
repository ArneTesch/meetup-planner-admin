import gql from "graphql-tag";

export const GET_SPEAKERS = gql`
  {
    speakers {
      _id
      name
      age
      expertise {
        title
        domain
      }
      nationality
      avatar
    }
  }
`;

export const GET_MEETUPS = gql`
  {
    meetups {
      _id
      title
      description
      date
      location
      speakers {
        _id
        name
        age
        expertise {
          title
          domain
        }
        nationality
        avatar
      }
      visitors {
        _id
        lastName
        firstname
        email
      }
    }
  }
`;

export const CREATE_MEETUP = gql`
  mutation CreateMeetup(
    $title: String!
    $description: String!
    $date: String!
    $location: String!
    $speakers: [ID!]
  ) {
    createMeetup(
      meetupInput: {
        title: $title
        description: $description
        date: $date
        location: $location
        speakers: $speakers
      }
    ) {
      title
      description
      date
      location
      speakers {
        _id
        name
      }
    }
  }
`;

export const DELETE_MEETUP = gql`
  mutation DeleteMeetup($id: ID!) {
    deleteMeetup(meetupId: $id) {
      _id
      title
    }
  }
`;

export const UPDATE_MEETUP = gql`
  mutation UpdateMeetup(
    $id: ID!
    $title: String!
    $description: String!
    $date: String!
    $location: String!
    $speakers: [ID!]
  ) {
    updateMeetup(
      updateMeetupInput: {
        _id: $id
        title: $title
        description: $description
        date: $date
        location: $location
        speakers: $speakers
      }
    ) {
      _id
      title
      description
      date
      location
      speakers {
        _id
        name
      }
    }
  }
`;
