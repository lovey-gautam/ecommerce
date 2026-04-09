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
    
    <div className='flex gap-5 w-max'>
      <div className='gap-5 flex flex-col'>{
        
        images.map((img,idx)=>{
         return <img onClick={()=>setMainImg(img.url)}
           key={idx}
           src={img.url} alt="" 
           className='cursor-pointer w-20 border shadow-lg'/>
        })
        }
      </div>
      <Zoom>
      
       <img src={mainImg} alt="" className='w-[500px] border shadow-lg'/>

      </Zoom>
    </div>
  )
}

export default ProductImg
