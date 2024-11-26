import { useEffect, useState } from "react";
import axios from 'axios';

function App() {
  const [items, setItems] = useState([]);
  const [newItem , setNewItem] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(false);

  const sendData = async (item) =>{
    try{
      const response = await axios.post("http://localhost:3000/items" , item);
      console.log("item added" , response.data);
    }catch(error){
      console.log("error " , error);
      setErr(error);
    }
  };
  const delData = async (id) => {
    try{
      const response  = await axios.delete(`http://localhost:3000/items/${id}`);
      console.log("item deleted successfuly");
    }
    catch(err){
      console.error("error deleting item " , err);
    } 
  }

  const handleDel = (index) => {
    
           const newItems = items.filter((item , i)=> i!== index);
            setItems(newItems);
            const id = index + 1;
            delData(id);
  }
  const handleClick = () => {
      const nItem = {
        id : items.length + 1,
        item : newItem
      }
      if(!nItem.item){
        console.log("item is empty or invalid");
        return;
      }
      sendData(nItem);
      setItems([...items , nItem]);
      setNewItem("");
  }
  
  const reset = async () => {
    if (window.confirm("Are you sure you want to clear all items?")) {
      try {
        const response = await axios.delete("http://localhost:3000/items");
        setItems([]);
        console.log("Data cleared successfully");
      } catch (err) {
        console.error("Error clearing data:", err);
      }
    }
  };
  useEffect(() => {
    const fetchData =  () => {
       axios.get("http://localhost:3000/items")
      .then(response => {
        setItems(response.data);
      })
      .catch(error => {
        console.log(error);
        setErr(error)
      })
      .finally(()=>{
        setLoading(false);
      })
      }
    fetchData();
  }, []);
  if (loading) return <h3>Loading...</h3>;
  if (err) return <h3>{err}</h3>;

  return (
    <>
      <h1>To-Do List:</h1>
      <input type="text" onChange={(e)=>{setNewItem(e.target.value)}} value={newItem}/>
      <button onClick={handleClick}>add</button>
      <ul>
        {items.map((i, index) => (
          <li key={index}>{i.item}<br/><button style={{backgroundColor : "red"}} onClick={()=>handleDel(index)}>del</button></li>
          
        ))}
      </ul>
      <button onClick={reset}>Reset</button>
    </>
  );
}

export default App;
