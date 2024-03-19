export default function intToDate(int:number)  {
    const date = new Date(int * 1000);
    return date.toDateString();
}