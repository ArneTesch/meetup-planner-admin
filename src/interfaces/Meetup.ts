import Speaker from "./Speaker";
import Visitor from "./Visitors";

type Meetup = {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  speakers?: [Speaker];
  visitors?: [Visitor];
};

export default Meetup;
