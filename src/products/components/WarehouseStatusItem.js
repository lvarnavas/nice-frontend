const WarehouseStatusItem = (props) => {
  return (
    <tbody>
      <tr>
        {/* <td>{props.id}</td>*/}
        <td>{props.productName}</td>
        <td>{props.quantity}</td>
        <td>{props.totalQuantity}</td> {/* This line is added */}
      </tr>
    </tbody>
  );
};

export default WarehouseStatusItem;
