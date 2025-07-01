const WarehouseStatusItem = (props) => {
  return (
      <tr>
        <td>{props.productName}</td>
        <td>{props.quantity}</td>
        <td>{props.totalQuantity}</td>
      </tr>
  );
};

export default WarehouseStatusItem;
