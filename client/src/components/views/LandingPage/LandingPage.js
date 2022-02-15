import React, { useEffect } from 'react';
import axios from 'axios';
//import { withRouter } from 'react-router-dom'; 
function LandingPage(props) {

  useEffect(() => {
    axios.get('/api/hello') // get req를 서버에 보냄. end point = /api/hello
      .then(response => { console.log(response.data) })
  }, [])

  return (
    <div>LandingPage 여기는 랜딩페이지</div>
  )
}

export default LandingPage
