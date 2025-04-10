import React, { useState } from 'react'
import banner from '../assets/images/banner.png'
import { Link, useNavigate } from 'react-router-dom'
import Loading from './Loading';
const Home = () => {
  const [loading,setLoading]=useState(false);
  const navigate=useNavigate();
  const handleStateQuiz=()=>{
    setLoading(true);
    setTimeout(()=>{
      navigate('/quiz')
      setLoading(false);
    },2000)
  }
  return (
    <section className='lg:w-9/12 md:w-[90%] px-4 mx-auto mt-12 flex flex-col md:flex-row-reverse justify-between'>
      {loading&&<Loading/>}
      {/* left side */}
      <div className='md:w-1/2 w-full space-y-8 mb-5'>
        <h2 className='my-8 lg:text-4xl text-3xl font-medium text-[#333] md:w-4/6 leading-normal mb-3'>Learn new concepts for each question</h2>
        <p className='py-2 mb-6 text-gray-500 pl-2 border-l-4 border-indigo-700 text-base'>We are from Blind Code Team, Quest CSE, JNTUH</p>
        <div className='text-lg font-medium flex flex-col sm:flex-row gap-5'>
          <button onClick={handleStateQuiz} className='bg-primary px-6 py-2 text-white rounded'>Start Quiz</button>
        </div>
      </div>
      {/* right side */}
      <div className='md:w-1/2'>
        <img src={banner} alt="Banner" className='mx-auto w-full' />
      </div>
    </section>
  )
}

export default Home