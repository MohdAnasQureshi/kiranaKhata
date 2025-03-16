import React, { useContext, useEffect, useState } from "react";
import Button from "../../ui/Button";
import Textarea from "../../ui/Textarea";
import PropTypes from "prop-types";
import { ModalContext } from "../../ui/Modal";
import { useEditStockList } from "./useEditStockList";

const EditStockList = ({
  stockOrderLists,
  selectedLists,
  setSelectedLists,
}) => {
  const [stockListText, setStockListText] = useState("");
  const { close } = useContext(ModalContext);
  const { mutate, isEditing } = useEditStockList(selectedLists[0]);

  useEffect(() => {
    const currentStockListText = stockOrderLists?.data
      ?.filter((list) => selectedLists.includes(list._id))
      .map((list) => list.stockList)
      .join("\n");
    setStockListText(currentStockListText);
  }, [stockOrderLists, selectedLists]);

  function handleTextAreaChange(e) {
    setStockListText(e.target.value);
  }

  function handleEdit() {
    mutate(
      { editedStockList: stockListText },
      {
        onSuccess: () => {
          setSelectedLists([]);
          close();
        },
      }
    );
  }
  return (
    <div>
      <Textarea
        name=""
        id=""
        value={stockListText}
        style={{ height: "30vh" }}
        onChange={(e) => handleTextAreaChange(e)}
      />

      <Button
        style={{ margin: "1rem" }}
        size="medium"
        $variation="secondary"
        onClick={close}
        disabled={isEditing}
      >
        Cancel
      </Button>
      <Button
        style={{ margin: "1rem" }}
        size="medium"
        onClick={handleEdit}
        disabled={isEditing}
      >
        Edit
      </Button>
    </div>
  );
};

EditStockList.propTypes = {
  stockOrderLists: PropTypes.object,
  selectedLists: PropTypes.array,
  setSelectedLists: PropTypes.func,
};

export default EditStockList;
