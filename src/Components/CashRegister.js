import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout, createTransaction } from "../store";

const CashRegister = () => {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [transaction, setTransaction] = useState({
    total: 0.0,
    tendered: 0.0,
    change: 0.0,
    complete: false,
    userId: auth.id,
  });

  const [items, setItems] = useState([
    {
      taxState: "none",
      discount: 0.0,
      name: "unnamed item",
      quantity: 1,
      price: 0.0,
    },
  ]);

  useEffect(() => {
    console.log("transaction after change", transaction);
  }, [transaction]);

  const onChangeTransaction = (ev) => {
    setTransaction({
      ...transaction,
      [ev.target.name]: ev.target.value,
    });
  };

  const onChangeItems = (ev, idx) => {
    const { name, value } = ev.target;
    const copy = [...items];
    copy[idx] = {
      ...copy[idx],
      [name]: value,
    };
    setItems(copy);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        taxState: "none",
        discount: 0.0,
        name: "unnamed item",
        quantity: 1,
        price: 0.0,
      },
    ]);
  };

  const create = async (ev) => {
    ev.preventDefault();
    await dispatch(createTransaction({ transaction, items }));
    setTransaction({
      total: 0.0,
      tendered: 0.0,
      change: 0.0,
      complete: false,
      userId: auth.id,
    });
    setItems([
      {
        taxState: "none",
        discount: 0.0,
        name: "unnamed item",
        quantity: 1,
        price: 0.0,
      },
    ]);
  };

  const calculateTotal = () => {
    let total = 0.0;
    console.log(items);
    for (const item of items) {
      if (item.discount) {
        const discountFraction = item.discount / 100;
        const discountedPrice = item.price * (1 - discountFraction) * 1;
        total += discountedPrice * item.quantity;
        if (item.taxState === "NY") {
          total += discountedPrice * 0.08875 * item.quantity;
        }
      } else {
        total += item.price * item.quantity;
        if (item.taxState === "NY") {
          total += item.price * 0.08875 * item.quantity;
        }
      }
    }

    setTransaction({ ...transaction, total });
  };

  const calculateChange = () => {
    console.log("transaction", transaction);

    if (transaction.tendered * 1 < transaction.total * 1) {
      alert("need more cash");
    } else {
      let change = transaction.tendered * 1 - transaction.total * 1;
      setTransaction({ ...transaction, change });
    }
  };

  return (
    <div>
      <h1>Cash Register</h1>
      <div>
        Welcome {auth.username}!!
        <button onClick={() => dispatch(logout())}>Logout</button>
      </div>
      <form onSubmit={create}>
        {items.map((item, idx) => {
          return (
            <div key={idx} className="item">
              <label>
                name
                <input
                  label="name"
                  value={item.name}
                  name="name"
                  onChange={(ev) => onChangeItems(ev, idx)}
                />
              </label>
              <label>
                quantity
                <input
                  type="number"
                  label="quantity"
                  value={item.quantity}
                  name="quantity"
                  onChange={(ev) => onChangeItems(ev, idx)}
                />
              </label>
              <label>
                price
                <input
                  type="number"
                  label="price"
                  value={item.price}
                  name="price"
                  onChange={(ev) => onChangeItems(ev, idx)}
                />
              </label>
              <label>
                discount
                <input
                  type="number"
                  label="discount"
                  value={item.discount}
                  name="discount"
                  onChange={(ev) => onChangeItems(ev, idx)}
                />
              </label>
              <label>
                tax?
                <select
                  label="discount"
                  value={item.taxState}
                  name="taxState"
                  onChange={(ev) => onChangeItems(ev, idx)}
                >
                  <option value="NY">NY</option>
                  <option value="none">none</option>
                </select>
              </label>
            </div>
          );
        })}
        <button type="button" onClick={addItem} aria-haspopup="true">
          add more items
        </button>
        <button type="button" onClick={calculateTotal}>
          calculate total
        </button>
        <label>
          total
          <input
            type="number"
            label="total"
            value={transaction.total}
            name="total"
            onChange={onChangeTransaction}
          />
        </label>
        <label>
          tendered
          <input
            type="number"
            label="tendered"
            value={transaction.tendered}
            name="tendered"
            onChange={onChangeTransaction}
          />
        </label>
        <button type="button" onClick={calculateChange}>
          calculate change
        </button>
        <label>
          change
          <input
            type="number"
            label="change"
            value={transaction.change}
            name="change"
            onChange={onChangeTransaction}
          />
        </label>
        <button type="submit">finish transaction</button>
      </form>
    </div>
  );
};

export default CashRegister;
