import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
const axios = require('axios')

export default function Home() {
  const [comments, setComments] = useState([]);

  const fetcher = async () => {
    await axios.get('https://node-comments-api.herokuapp.com/subscribers') 
      .then((res) => setComments(res.data))
      .catch((err) => console.log(err))
  }
  
  useEffect(() => {
    fetcher()
  }, []);

/*   useEffect(() => {
    const intervalId = setInterval(() => {
      fetcher()
    }, 3000);
  
    return () => clearInterval(intervalId);
  }, []); */

  

  const commentsHTML = comments.map((comm, index) => {
    return( 
    <div key={index}>
      <h3>{comm.name}</h3>
      <p>{comm.commentText}</p>
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
    axios.post('http://127.0.0.1:3000/subscribers', toSubmit)
  }
  return (
    <div>
      {!commentsHTML ? '' : commentsHTML }
      <form onSubmit={submitHandler}>
        <label htmlFor="comment">Comment</label>
        <input name="comment" type="text" required />
        <label htmlFor="name">Name</label>
        <input name="name" type="text" required />
        <button type='submit'>Submit</button>
      </form>
    </div>
  )
}
