import { useState, useContext } from 'react'
import { useEffect } from 'react'
import * as go from 'gojs'
import Joyride from 'react-joyride'
import { goJsContext } from '../../../context/gojsContext'
import DiagramWrapper from './Wrapper'
import Modal from '../../Modal/index'
import shortLinks from '../../../services/shortLink'

const Diagram = () => {
  const { diagram } = useContext(goJsContext)
  const initDiagram = {
    modelData: {
      canRelink: true,
    },
    selectedKey: null,
    skipsDiagramUpdate: false,
  }
  const initStepsIntro = {
    run: false,
    steps: [
      {
        locale: {
          skip: <strong aria-label='skip'>SKIP</strong>,
          next: <strong aria-label='next'>siguiente</strong>,
        },
        placement: 'center',
        content: (
          <h2 className='my-4 text-1xl md:text-2xl text-black  font-bold leading-tight text-center md:text-left'>
            Bienvendio a Un util pero sencillo editor de diagramas
          </h2>
        ),
        target: 'body',
      },
      {
        locale: {
          skip: (
            <strong aria-label='skip' className='text-violet-900'>
              SKIP
            </strong>
          ),
          next: <strong aria-label='next'>siguiente</strong>,
          back: (
            <strong aria-label='next' className='#6d28d9'>
              anterior
            </strong>
          ),
        },
        target: '.diagram-background',
        content: (
          <p className='text-base leading-relaxed text-violet-900 '>
            Esta es tu mesa de trabajo los controles son basicos eintuitivos
            sientete libre de explorar
          </p>
        ),
      },
      {
        locale: {
          skip: (
            <strong aria-label='skip' className='text-violet-900'>
              SKIP
            </strong>
          ),
          next: <strong aria-label='next'>siguiente</strong>,
          back: (
            <strong aria-label='next' className='#6d28d9'>
              anterior
            </strong>
          ),
        },
        target: '.tools-diagram',
        content: (
          <p className='text-base leading-relaxed text-violet-900 '>
            Estas son tus opciones a elegir, arrastralas al diagrama para
            comenzar a usarlas{' '}
          </p>
        ),
      },
      {
        locale: {
          skip: (
            <strong aria-label='skip' className='text-violet-900'>
              SKIP
            </strong>
          ),
          next: <strong aria-label='next'>siguiente</strong>,
          back: (
            <strong aria-label='next' className='#6d28d9'>
              anterior
            </strong>
          ),
        },
        target: '.btn-to-share',
        content: (
          <p className='text-base leading-relaxed text-violet-900 '>
            Una vez terminado puedes compartir tu diagrama con un comodo link
            acortado
          </p>
        ),
      },
      {
        locale: {
          skip: (
            <strong aria-label='skip' className='text-violet-900'>
              SKIP
            </strong>
          ),
          next: <strong aria-label='next'>siguiente</strong>,
          back: (
            <strong aria-label='next' className='#6d28d9'>
              anterior
            </strong>
          ),
          last: <strong aria-label='next'>cerrar</strong>,
        },
        target: '.btn-to-print',
        content: (
          <p className='text-base leading-relaxed text-violet-900 '>
            Tambien puedes exportar tu diagrama como un svg e incluso guardar el
            mismo como pdf
          </p>
        ),
      },
    ],
  }

  const [stateDiagram, setStateDiagram] = useState(initDiagram)
  const [stepsIntro, setStpsIntro] = useState(() => initStepsIntro)
  const [showModal, setShowModal] = useState({ isShow: false, data: '' })

  useEffect(() => {
    if (!window.localStorage.getItem('wasGuided')) {
      setStpsIntro((prev) => ({ ...prev, run: true }))
    }

    const { pathname } = window.location
    if (pathname.length > 2) {
      try {
        const svgDiagram = window.atob(pathname.slice(1))
        diagram.model = go.Model.fromJson(svgDiagram)
      } catch (error) {
        alert('invalid url')
      }
    }
  }, [])

  const handleDiagramEvent = (e) => {
    const name = e.name
    if (name == 'ChangedSelection') {
      const sel = e.subject.first()
      if (sel) {
        setStateDiagram((prev) => {
          return { ...prev, selectedKey: sel.key }
        })
      } else {
        setStateDiagram((prev) => {
          return { ...prev, selectedKey: null }
        })
      }
    }
  }
  const handleModelChange = (obj) => {
    if (diagram.isModified) {
      const hashSvg = window.btoa(diagram.model.toJson())
      window.history.replaceState(null, null, `/${hashSvg}`)
      diagram.isModified = false
    }
  }
  const toShare = async () => {
    const destination = window.location.href
    const link = await shortLinks(destination)
    if (link?.message) {
      console.log('link error :', link.message)
    } else {
      setShowModal({
        isShow: true,
        data: link,
      })
    }
  }

  const printDiagram = () => {
    let svgWindow = window.open()
    if (!svgWindow) return
    var printSize = new go.Size(700, 960)
    let bnds = diagram.documentBounds
    let x = bnds.x
    let y = bnds.y
    while (y < bnds.bottom) {
      while (x < bnds.right) {
        let svg = diagram.makeSvg({
          scale: 1.0,
          position: new go.Point(x, y),
          size: printSize,
        })
        svgWindow.document.body.appendChild(svg)
        x += printSize.width
      }
      x = bnds.x
      y += printSize.height
    }
    setTimeout(() => svgWindow.print(), 1)
  }
  const handleCloseModal = () => {
    setShowModal({
      isShow: false,
      data: '',
    })
  }
  const changeSteps = ({ status }) => {
    if (status === 'finished') {
      window.localStorage.setItem('wasGuided', 'yes')
      setStpsIntro((prev) => ({ ...prev, run: false }))
    }
  }
  return (
    <>
      <Joyride
        run={stepsIntro.run}
        steps={stepsIntro.steps}
        callback={changeSteps}
        continuous
        hideCloseButton
        scrollToFirstStep
        showProgress
        showSkipButton
        styles={{
          options: {
            zIndex: 10000,
            primaryColor: ' #6d28d9',
          },
        }}
      />

      <div className='mx-auto w-full bg-slate-100 h-[500px] m-0' role='panel'>
        <div className='w-full h-full relative'>
          <div className='absolute top-0 left-0 w-full  pt-1  flex flex-row-reverse z-10 '>
            <button
              type='button'
              className='btn-to-share text-white bg-gradient-to-r from-violet-500 via-vilet-600 to-violet-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2'
              onClick={toShare}
            >
              to share{' '}
            </button>
            <button
              type='button'
              className='btn-to-print   text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2'
              onClick={printDiagram}
            >
              print a svg{' '}
            </button>
          </div>
          <DiagramWrapper
            modelData={stateDiagram.modelData}
            skipsDiagramUpdate={stateDiagram.skipsDiagramUpdate}
            onDiagramEvent={handleDiagramEvent}
            onModelChange={handleModelChange}
          />
          {stateDiagram.selectedKey !== null && (
            <p>Selected key: {stateDiagram.selectedKey}</p>
          )}
        </div>
      </div>
      {showModal?.isShow && (
        <Modal toCloseModal={handleCloseModal} dataToShow={showModal.data} />
      )}
    </>
  )
}

export default Diagram
