import { useState, useEffect } from "react"

export default function ImagesSlide() {
  const [currentImage, setCurrentImage] = useState(0)

  // images
  const images = [
    {
      id: 1,
      src: "nz-wallpaper.jpg",
      alt: "milford sound wallpaper"
    },
    {
      id: 2,
      src: "nz-wallpaper-1.jpg",
      alt: ""
    },
    {
      id: 3,
      src: "nz-wallpaper-2.jpg",
      alt: "south islands wallpaper"
    },
    /*{
      id: 4,
      src: "bay-of-islands.jpg",
      alt: "bay of islands wallpaper"
    },*/
    {
      id: 5,
      src: "lake-taupo.jpg",
      alt: "lake taupo wallpaper"
    },
    {
      id: 6,
      src: "kaikoura.jpg",
      alt: "kaikoura wallpaper"
    },
  ]

  // component mounted
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage(prev => prev += 1)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // currentImage changes
  useEffect(() => {
    if (currentImage >= images.length) {
      setCurrentImage(0)
    }
    // console.log(currentImage)
  }, [currentImage])

  return(
    <div className="relative h-full">
      {images.map((image, index) => (
        <div className="absolute top-0 left-0 w-full h-full">
          <img
            key={index}
            src={`https://ik.imagekit.io/vmg06uqkt/nz-tax-calculator/${image.src}`}
            alt={image.alt}
            className={`${currentImage == index ? '' : 'opacity-0'} w-full h-full object-cover transition duration-500`}
          />
        </div>
      ))}
    </div>
  )
}
