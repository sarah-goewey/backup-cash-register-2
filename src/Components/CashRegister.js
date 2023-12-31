import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createTransaction } from "../store";

const CashRegister = () => {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [transaction, setTransaction] = useState({
    total: 0.0,
    tendered: 0.0,
    change: 0.0,
    userId: auth.id,
  });

  const [items, setItems] = useState([
    {
      taxState: "NY",
      discount: 0.0,
      name: "unnamed item",
      quantity: 1,
      price: 0.0,
    },
  ]);

  const [globalDiscount, setGlobalDiscount] = useState(0.0);
  const [globalTaxState, setGlobalTaxState] = useState("NY");

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
    calculateSubTotal(copy[idx]);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        taxState: "NY",
        discount: 0.0,
        name: "unnamed item",
        quantity: 1,
        price: 0.0,
      },
    ]);
  };

  const cancelItem = (item) => {
    setItems(items.filter((i) => i !== item));
  };

  const create = async (ev) => {
    ev.preventDefault();
    await dispatch(createTransaction({ transaction, items }));
    setTransaction({
      total: 0.0,
      tendered: 0.0,
      change: 0.0,
      userId: auth.id,
    });
    setItems([
      {
        taxState: "NY",
        discount: 0.0,
        name: "unnamed item",
        quantity: 1,
        price: 0.0,
      },
    ]);
  };

  const calculateSubTotal = (item) => {
    let totalCents = 0;
    if (item.discount) {
      const discountFraction = item.discount / 100;
      const discountedPriceCents = Math.round(
        item.price * (1 - discountFraction) * 100
      );
      totalCents += discountedPriceCents * item.quantity;
      if (item.taxState !== "none") {
        const taxAmountCents = calculateTax(discountedPriceCents, item);
        totalCents += taxAmountCents;
      }
    } else {
      const priceCents = Math.round(item.price * 100);
      totalCents += priceCents * item.quantity;
      if (item.taxState !== "none") {
        const taxAmountCents = calculateTax(priceCents, item);
        totalCents += taxAmountCents;
      }
    }
    const subtotal = (totalCents / 100).toFixed(2);
    item.subtotal = subtotal;
  };

  const calculateTotal = () => {
    let totalCents = 0;
    for (const item of items) {
      if (item.subtotal) {
        totalCents += item.subtotal * 100;
      }
    }
    const total = (totalCents / 100).toFixed(2);
    setTransaction({ ...transaction, total });
  };

  /* const calculateTotal = () => {
    let totalCents = 0;
    for (const item of items) {
      if (item.discount) {
        const discountFraction = item.discount / 100;
        const discountedPriceCents = Math.round(
          item.price * (1 - discountFraction) * 100
        );
        totalCents += discountedPriceCents * item.quantity;
        if (item.taxState !== "none") {
          const taxAmountCents = calculateTax(discountedPriceCents, item);
          totalCents += taxAmountCents;
        }
      } else {
        const priceCents = Math.round(item.price * 100);
        totalCents += priceCents * item.quantity;
        if (item.taxState !== "none") {
          const taxAmountCents = calculateTax(priceCents, item);
          totalCents += taxAmountCents;
        }
      }
    }
    const total = (totalCents / 100).toFixed(2);
    setTransaction({ ...transaction, total });
  };*/

  const calculateTax = (priceCents, item) => {
    let taxAmountCents = 0;
    if (item.taxState === "NY") {
      taxAmountCents = Math.round(priceCents * 0.08875 * item.quantity);
    }
    if (item.taxState === "NJ") {
      taxAmountCents = Math.round(priceCents * 0.0663 * item.quantity);
    }
    if (item.taxState === "CT") {
      taxAmountCents = Math.round(priceCents * 0.0635 * item.quantity);
    }
    if (item.taxState === "PA") {
      taxAmountCents = Math.round(priceCents * 0.08 * item.quantity);
    }
    return taxAmountCents;
  };

  const calculateChange = () => {
    if (transaction.tendered * 1 < transaction.total * 1) {
      alert("need more cash");
    } else {
      const tenderedCents = transaction.tendered * 100;
      const totalCents = transaction.total * 100;
      const changeCents = tenderedCents - totalCents;

      const change = (changeCents / 100).toFixed(2);
      setTransaction({ ...transaction, change });
    }
  };

  const addGlobalDiscount = (globalDiscount) => {
    setGlobalDiscount(globalDiscount);
    const updatedItems = items.map((item) => ({
      ...item,
      discount: globalDiscount,
    }));
    setItems(updatedItems);

    updatedItems.forEach(calculateSubTotal);
  };

  const addGlobalTaxState = (globalTaxState) => {
    setGlobalTaxState(globalTaxState);
    const updatedItems = items.map((item) => ({
      ...item,
      taxState: globalTaxState,
    }));
    setItems(updatedItems);

    updatedItems.forEach(calculateSubTotal);
  };

  return (
    <form onSubmit={create}>
      <div className="items">
        {items.map((item, idx) => {
          return (
            <div key={idx} className="item">
              <p>{idx + 1}.</p>
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
                tax
                <select
                  label="taxState"
                  value={item.taxState}
                  name="taxState"
                  onChange={(ev) => onChangeItems(ev, idx)}
                >
                  <option value="NY">NY 8.875%</option>
                  <option value="NJ">NJ 6.63%</option>
                  <option value="CT">CT 6.35%</option>
                  <option value="PA">PA 8%</option>
                  <option value="none">none</option>
                </select>
              </label>
              <p>subtotal: {item.subtotal || "0.0"}</p>
              <button
                onClick={() => cancelItem(item)}
                style={{ width: "25px", marginLeft: "15px" }}
              >
                x
              </button>
            </div>
          );
        })}
      </div>
      <button type="button" onClick={addItem} aria-haspopup="true">
        add more items
      </button>
      <div className="globals">
        <label>
          discount
          <input
            type="number"
            label="discount"
            value={globalDiscount}
            name="discount"
            style={{ width: "75px" }}
            onChange={(ev) => addGlobalDiscount(ev.target.value)}
          />
        </label>
        <label>
          tax
          <select
            label="taxState"
            value={globalTaxState}
            name="taxState"
            onChange={(ev) => addGlobalTaxState(ev.target.value)}
          >
            <option value="NY">NY 8.875%</option>
            <option value="NJ">NJ 6.63%</option>
            <option value="CT">CT 6.35%</option>
            <option value="PA">PA 8%</option>
            <option value="none">none</option>
          </select>
        </label>
        <button type="button" onClick={calculateTotal}>
          calculate total
        </button>
        <p>
          total: <b>{transaction.total || "0.0"}</b>
        </p>

        <label>
          tendered
          <input
            type="number"
            label="tendered"
            value={transaction.tendered}
            name="tendered"
            style={{ width: "75px" }}
            onChange={onChangeTransaction}
          />
        </label>
        <button type="button" onClick={calculateChange}>
          calculate change
        </button>
        <p>
          change: <b>{transaction.change || "0.0"}</b>
        </p>
        <button type="submit">finish transaction</button>
      </div>
    </form>
  );
};

export default CashRegister;
