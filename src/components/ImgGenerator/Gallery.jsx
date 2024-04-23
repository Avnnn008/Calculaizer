import { useEffect, useRef} from 'react'
import { useInView } from 'react-intersection-observer';
import s from '../imggenerator.module.css'
import { useHttp } from '../../hooks/http-hook'
import { useDispatch, useSelector } from 'react-redux'
import { clearImgGallery, deleteImgFromGallery, saveImgToGallery} from '../../redux/userInfoSlice'
import Spinner from '../Loaders/Spinner'

export default function Gallery () {
    const gallery = useSelector(state=>state.userInfoReducer.imgGallery)
    const {request, loading} = useHttp()
    const dispatch = useDispatch()
    const limit = 8
    const skip = useRef(null)
    const galleryWindow = useRef(null)

    useEffect(()=> {
      getGallery()
    }, [skip.current])

  const getGallery = async () => {
       try {
        const data = await request(`/imggen/gallery?limit=${limit}&skip=${skip.current ? skip.current : 0}`)
        data.gallery.map(el=> dispatch(saveImgToGallery(el)))    
    } catch {}

   
  }

  /* Очистка state галерии при закрытии окна галереи  */
   useEffect(()=> {
    return (()=> {
        dispatch(clearImgGallery())
    })
   }, [])

     /* Отлавливание элемента из списка для загрузки следующей порции картинок */
  const { ref, inView} = useInView({
    threshold: 0,
    onChange: (inView) => {
      if (inView) {
        skip.current = gallery.length
      }
    }
  });
   
   const deleteImg = async (e) => { 
    try {
      await request('/openai/deleteimg', 'POST', {id: e.target.dataset.key})
      dispatch(deleteImgFromGallery(e.target.dataset.key))
    } catch {}
    
   }

    return (
        <div className={s.gallery} ref={galleryWindow}>
            
        <div className={s.galleryField}>
            {loading && <div className={s.galleryloading}><Spinner/></div>}
            {gallery.length === 0 ? (!loading && <div className={s.galleryInfo}>Ваша галерея пока пуста</div>) :
          <div className={s.galleryList}>
             {gallery.map((el, index) => (
                <div className={s.picture} key={el._id} ref={index === (gallery.length-1) ? ref : undefined }>
              <div className={s.icon}>
                <a href={el.url} target='_blank'><img src={el.url} alt="" />
                </a>
              
              <div className={s.size}>{el.size}</div>
              
              </div>
              <div className={s.name}>{el.name}</div>
              <i className="fa-solid fa-trash" data-key={el._id} onClick={deleteImg}></i>
            </div>
            ))}
            
            
          </div>}
        </div>
      </div>
    )
}