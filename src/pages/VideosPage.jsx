import { useOutletContext } from 'react-router-dom'
import VideosTab from '../components/VideosTab.jsx'

function VideosPage() {
  const { level } = useOutletContext()
  return <VideosTab level={level} />
}

export default VideosPage
