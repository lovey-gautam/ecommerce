import React, { useState } from 'react'
import { useEffect } from 'react'
import Zoom from 'react-medium-image-zoom'

const ProductImg = ({images=[]}) => {
  const [mainImg,setMainImg] = useState(images[0]?.url ||'/placeholder.png')
  useEffect(() => {
    if (images.length > 0) {
      setMainImg(images[0].url);
    } else {
      setMainImg('/placeholder.png');
    }
  }, [images]);

  useEffect(() => {
  console.log("images prop:", images);
}, [images]);
  return (
    
    <div className='flex flex-col md:flex-row gap-4 w-full'>
      <div className='flex md:flex-col gap-3 overflow-x-auto md:overflow-visible'>{
        
        images.map((img,idx)=>{
         return <img onClick={()=>setMainImg(img.url)}
           key={idx}
           src={img.url} alt="" 
           className='cursor-pointer w-16 h-16 object-cover border shadow-md flex-shrink-0'/>
        })
        }
      </div>
      <div className = "w-full flex justify-center">
      <Zoom>
      
       <img src={mainImg} alt="" 
        className='w-full max-w-md md:max-w-lg object-contain border shadow-lg'
/>

      </Zoom>
      </div>
    </div>
  )
}

export default ProductImg
