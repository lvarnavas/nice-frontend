import "../TableItem.css";

const TotalCarLoadsItem = ({ item }) => {
  console.log(item);
  return (
    <tr>
      {Object.entries(item).map(([key, value], index) => (
        <td key={index}>{value}</td>
      ))}
    </tr>
  );
};

export default TotalCarLoadsItem;
