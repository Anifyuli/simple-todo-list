export interface Data {
  id: number;
  title: string;
  completed: boolean;
}

let datas: Data[] = [
  {
    id: 1,
    title: "Wiping living room",
    completed: true,
  },
  {
    id: 2,
    title: "Buying lettuce",
    completed: false,
  },
  {
    id: 3,
    title: "Washing dish", 
    completed: true,
  },
  {
    id: 4,
    title: "Feeding lambs",
    completed: false,
  },
];

export default datas;