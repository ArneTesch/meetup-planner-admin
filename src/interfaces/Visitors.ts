import Meetup from "./Meetup";

type Visitor = {
  _id: string;
  lastName: string;
  firstname: string;
  email: string;
  password: string;
  meetups?: [Meetup];
};

export default Visitor;
