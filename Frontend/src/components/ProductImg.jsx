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
      <div className='flex md:flex-col flex-row gap-2 
                      overflow-x-auto md:overflow-y-auto 
                      max-h-[400px]'> 
        
         {images.map((img,idx)=>(
         <img onClick={()=>setMainImg(img.url)}
           key={idx}
           src={img.url} alt=""
          
           className={`cursor-pointer w-14 h-14 sm:w-14 sm:h-14 md:w-16 md:h-16  object-cover border 
              ${mainImg === img.url ? 'border-pink-600 ' : ''}`}
           />
        )) }
      </div>
      <div className = "flex-1 flex justify-center">
      <Zoom>
      
       <img src={mainImg} alt="" 
        className='w-full max-w-md object-contain border'
/>

      </Zoom>
      </div>
    </div>
  )
}

export default ProductImg
