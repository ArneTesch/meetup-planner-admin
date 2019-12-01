import Expertise from "./Expertise";

type Speaker = {
  _id: string;
  name: string;
  age: number;
  nationality: string;
  expertise: Expertise;
  avatar?: string;
};

export default Speaker;
