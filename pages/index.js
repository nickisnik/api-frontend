import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
const axios = require('axios')

export default function Home() {
  const [comments, setComments] = useState([]);
  const [editingText, setEditingText] = useState('');
  const [editedId, setEditedId] = useState('');
  const [editMode, setEditMode] = useState(false);
  const devMode = false;

  const url = devMode === true? 'http://localhost:3000' : 'https://node-comments-api.herokuapp.com';

  const fetcher = async () => {
    await axios.get(`${url}/subscribers`) 
      .then((res) => setComments(res.data))
      .catch((err) => console.log(err))
  }
  
  useEffect(() => {
    fetcher()
    
  }, []);

  useEffect(() => {
    if(!devMode) {return}
    const intervalId = setInterval(() => {
      fetcher()
    }, 3000);
  
    return () => clearInterval(intervalId);
  }, []);
  
  useEffect(() => {
    console.log(comments[0]?.["_id"])
  }, [comments])

  const dateConverter = (date) => {
    const ms = Date.parse(date);
    const dateObj = new Date(ms);
    return dateObj.toLocaleString();
  }

  const handleDelete = (comment) => {
    axios.delete(`${url}/subscribers/${comment}`)
      .catch((err) => console.log(err))
  }

  const handleEdit = (comm) => {
    if(!editMode) {
      setEditedId(comm["_id"])
      setEditingText(comm.commentText);
    } else {
      console.log(editingText)
      axios.patch(`${url}/subscribers/${comm["_id"]}`, {
        "commentText": editingText
      }).then(() => {
        setEditedId('')
        setEditingText('')
      }).catch((err) => console.log(err))
    }
    setEditMode((prev) => !prev)
  }

  const commentsHTML = [...comments].reverse().map((comm, index) => {
    return( 
    <div key={index} className="comment-box">
      <header className="comment-header">
        <h3 className='author'>{comm.name}</h3>
        <span className='comment-date'>{dateConverter(comm.commentDate)}</span>
      </header>
      {comm["_id"] === editedId ? <textarea value={editingText} onChange={(e) => {setEditingText(e.target.value)}} /> : <p className='comment'>{comm.commentText}</p>}
      <div className="comment-buttons">
        <button className='comment-edit' onClick={() => handleEdit(comm)}>{!editMode ? "Edit" : 'Confirm'}</button>
        <button className='comment-delete' onClick={() => handleDelete(comm?.["_id"])}>Delete</button>
      </div>
    </div>
    )
  })

  const submitHandler = (e) => {
    const text = e.target[0].value
    const name = e.target[1].value
   
    e.preventDefault()
    const toSubmit = {
      "commentText": text,
      "name": name
    }
    axios.post(`${url}/subscribers`, toSubmit)
  }
  return (
    <div className='app'>
      <div className="comment-list">{!commentsHTML ? '' : commentsHTML }</div>
      <form onSubmit={submitHandler} className="form">
        <textarea className='form-text' name="comment" type="text" placeholder='comment...' required></textarea>
        <div className="name-submit-box">
          <input className="form-name" name="name" type="text" placeholder='name...' required />
          <button className='form-btn' type='submit'>Submit</button>
        </div>
      </form>
    </div>
  )
}
