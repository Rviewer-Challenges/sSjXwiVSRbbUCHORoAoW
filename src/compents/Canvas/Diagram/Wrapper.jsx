import { useRef, useEffect, useContext } from 'react'
import * as go from 'gojs'
import { ReactDiagram, ReactPalette } from 'gojs-react'
import { goJsContext } from '../../../context/gojsContext'

const Wrapper = ({
  modelData,
  skipsDiagramUpdate,
  onDiagramEvent,
  onModelChange,
}) => {
  const { $, diagram, palette } = useContext(goJsContext)
  const diagramRef = useRef(null)

  useEffect(() => {
    const componentDidMount = () => {
      if (!diagramRef.current) return
      const diagram = diagramRef.current.getDiagram()
      if (diagram instanceof go.Diagram) {
        diagram.addDiagramListener('ChangedSelection', onDiagramEvent)
      }
    }
    const componentWillUnmount = () => {
      if (!diagramRef.current) return
      const diagram = diagramRef.current.getDiagram()
      if (diagram instanceof go.Diagram) {
        diagram.removeDiagramListener('ChangedSelection', onDiagramEvent)
      }
    }
    componentDidMount()
    return componentWillUnmount()
  })

  const nodeStyle = () => {
    return [
      // The Node.location comes from the "loc" property of the node data,
      // converted by the Point.parse static method.
      // If the Node.location is changed, it updates the "loc" property of the node data,
      // converting back using the Point.stringify static method.
      new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(
        go.Point.stringify
      ),
      {
        // the Node.location is at the center of each node
        locationSpot: go.Spot.Center,
      },
    ]
  }
  const makePort = (name, align, spot, output, input) => {
    let horizontal = align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom)
    // the port is basically just a transparent rectangle that stretches along the side of the node,
    // and becomes colored when the mouse passes over it
    return $(go.Shape, {
      fill: 'transparent', // changed to a color in the mouseEnter event handler
      strokeWidth: 0, // no stroke
      width: horizontal ? NaN : 8, // if not stretching horizontally, just 8 wide
      height: !horizontal ? NaN : 8, // if not stretching vertically, just 8 tall
      alignment: align, // align the port on the main Shape
      stretch: horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical,
      portId: name, // declare this object to be a "port"
      fromSpot: spot, // declare where links may connect at this port
      fromLinkable: output, // declare whether the user may draw links from here
      toSpot: spot, // declare where links may connect at this port
      toLinkable: input, // declare whether the user may draw links to here
      cursor: 'pointer', // show a different cursor to indicate potential link point
      mouseEnter: (e, port) => {
        // the PORT argument will be this Shape
        if (!e.diagram.isReadOnly) port.fill = 'rgba(255,0,255,0.5)'
      },
      mouseLeave: (e, port) => (port.fill = 'transparent'),
    })
  }
  const textStyle = () => {
    return {
      font: 'bold 11pt Lato, Helvetica, Arial, sans-serif',
      stroke: '#0a0a0a',
    }
  }

  const templmap = new go.Map()
  templmap.add(
    '', // the default category
    $(
      go.Node,
      'Table',
      nodeStyle(),
      // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
      $(
        go.Panel,
        'Auto',
        $(
          go.Shape,
          'Rectangle',
          { fill: '#d4e5f5', stroke: '#0095f8', strokeWidth: 1 },
          new go.Binding('figure', 'figure')
        ),
        $(
          go.TextBlock,
          textStyle(),
          {
            margin: 8,
            maxSize: new go.Size(160, NaN),
            wrap: go.TextBlock.WrapFit,
            editable: true,
          },
          new go.Binding('text').makeTwoWay()
        )
      ),
      // four named ports, one on each side:
      makePort('T', go.Spot.Top, go.Spot.TopSide, false, true),
      makePort('L', go.Spot.Left, go.Spot.LeftSide, true, true),
      makePort('R', go.Spot.Right, go.Spot.RightSide, true, true),
      makePort('B', go.Spot.Bottom, go.Spot.BottomSide, true, false)
    )
  )

  templmap.add(
    'Conditional',
    $(
      go.Node,
      'Table',
      nodeStyle(),
      // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
      $(
        go.Panel,
        'Auto',
        $(
          go.Shape,
          'Diamond',
          { fill: '#f3ab40', stroke: '#00A9C9', strokeWidth: 2 },
          new go.Binding('figure', 'figure')
        ),
        $(
          go.TextBlock,
          textStyle(),
          {
            margin: 8,
            maxSize: new go.Size(160, NaN),
            wrap: go.TextBlock.WrapFit,
            editable: true,
          },
          new go.Binding('text').makeTwoWay()
        )
      ),
      // four named ports, one on each side:
      makePort('T', go.Spot.Top, go.Spot.Top, false, true),
      makePort('L', go.Spot.Left, go.Spot.Left, true, true),
      makePort('R', go.Spot.Right, go.Spot.Right, true, true),
      makePort('B', go.Spot.Bottom, go.Spot.Bottom, true, false)
    )
  )

  templmap.add(
    'Start',
    $(
      go.Node,
      'Table',
      nodeStyle(),

      $(
        go.Panel,
        'Auto',
        $(go.Shape, 'Circle', {
          fill: '#aeebdb',
          stroke: '#09d3ac',
          strokeWidth: 3.5,
        }),
        $(
          go.TextBlock,
          'Start',
          textStyle(),
          {
            margin: 8,
            maxSize: new go.Size(160, NaN),
            wrap: go.TextBlock.WrapFit,
            editable: false,
          },
          new go.Binding('text').makeTwoWay()
        )
      ),
      // three named ports, one on each side except the top, all output only:
      makePort('L', go.Spot.Left, go.Spot.Left, true, false),
      makePort('R', go.Spot.Right, go.Spot.Right, true, false),
      makePort('B', go.Spot.Bottom, go.Spot.Bottom, true, false)
    )
  )
  templmap.add(
    'End',
    $(
      go.Node,
      'Table',
      nodeStyle(),
      $(
        go.Panel,
        'Spot',
        $(go.Shape, 'Circle', {
          desiredSize: new go.Size(60, 60),
          fill: '#f8b6b6',
          stroke: '#DC3C00',
          strokeWidth: 3.5,
        }),
        $(
          go.TextBlock,
          'End',
          textStyle(),
          {
            margin: 8,
            maxSize: new go.Size(160, NaN),
            wrap: go.TextBlock.WrapFit,
            editable: false,
          },
          new go.Binding('text').makeTwoWay()
        )
      ),
      // three named ports, one on each side except the bottom, all input only:
      makePort('T', go.Spot.Top, go.Spot.Top, false, true),
      makePort('L', go.Spot.Left, go.Spot.Left, false, true),
      makePort('R', go.Spot.Right, go.Spot.Right, false, true)
    )
  )

  go.Shape.defineFigureGenerator('File', (shape, w, h) => {
    var geo = new go.Geometry()
    var fig = new go.PathFigure(0, 0, true) // starting point
    geo.add(fig)
    fig.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0))
    fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.25 * h))
    fig.add(new go.PathSegment(go.PathSegment.Line, w, h))
    fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close())
    var fig2 = new go.PathFigure(0.75 * w, 0, false)
    geo.add(fig2)
    // The Fold
    fig2.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0.25 * h))
    fig2.add(new go.PathSegment(go.PathSegment.Line, w, 0.25 * h))
    geo.spot1 = new go.Spot(0, 0.25)
    geo.spot2 = go.Spot.BottomRight
    return geo
  })

  templmap.add(
    'Comment',
    $(
      go.Node,
      'Auto',
      nodeStyle(),
      $(go.Shape, 'File', {
        fill: '#eff0f1',
        stroke: '#DEE0A3',
        strokeWidth: 3,
      }),
      $(
        go.TextBlock,
        textStyle(),
        {
          margin: 8,
          maxSize: new go.Size(200, NaN),
          wrap: go.TextBlock.WrapFit,
          textAlign: 'center',
          editable: true,
        },
        new go.Binding('text').makeTwoWay()
      )
      // no ports, because no links are allowed to connect with a comment
    )
  )
  const initDiagram = () => {
    diagram.undoManager.isEnabled = true
    ;(diagram.model = new go.GraphLinksModel({
      linkKeyProperty: 'key',
      makeUniqueKeyFunction: (m, data) => {
        let k = data.key || 1
        while (m.findNodeDataForKey(k)) k++
        data.key = k
        return k
      },

      makeUniqueLinkKeyFunction: (m, data) => {
        let k = data.key || -1
        while (m.findLinkDataForKey(k)) k--
        data.key = k
        return k
      },
    })),
      (diagram.padding = 20),
      (diagram.grid = $(
        go.Panel,
        'Grid',
        $(go.Shape, 'LineH', { stroke: 'lightgray', strokeWidth: 0.5 }),
        $(go.Shape, 'LineV', { stroke: 'lightgray', strokeWidth: 0.5 })
      )),
      (diagram.nodeTemplateMap = templmap)
    diagram.linkTemplate = $(
      go.Link, // the whole link panel
      {
        routing: go.Link.AvoidsNodes,
        curve: go.Link.JumpOver,
        corner: 5,
        toShortLength: 4,
        relinkableFrom: true,
        relinkableTo: true,
        reshapable: true,
        resegmentable: true,
        // mouse-overs subtly highlight links:
        mouseEnter: (e, link) =>
          (link.findObject('HIGHLIGHT').stroke = 'rgba(30,144,255,0.2)'),
        mouseLeave: (e, link) =>
          (link.findObject('HIGHLIGHT').stroke = 'transparent'),
        selectionAdorned: false,
      },
      new go.Binding('points').makeTwoWay(),
      $(
        go.Shape, // the highlight shape, normally transparent
        {
          isPanelMain: true,
          strokeWidth: 8,
          stroke: 'transparent',
          name: 'HIGHLIGHT',
        }
      ),
      $(
        go.Shape, // the link path shape
        { isPanelMain: true, stroke: 'gray', strokeWidth: 2 },
        new go.Binding('stroke', 'isSelected', (sel) =>
          sel ? 'dodgerblue' : 'gray'
        ).ofObject()
      ),
      $(
        go.Shape, // the arrowhead
        { toArrow: 'standard', strokeWidth: 0, fill: 'gray' }
      ),
      $(
        go.Panel,
        'Auto', // the link label, normally not visible
        {
          visible: false,
          name: 'LABEL',
          segmentIndex: 2,
          segmentFraction: 0.5,
        },
        new go.Binding('visible', 'visible').makeTwoWay(),
        $(
          go.Shape,
          'RoundedRectangle', // the label shape
          { fill: '#F8F8F8', strokeWidth: 0 }
        ),
        $(
          go.TextBlock,
          'Yes', // the label
          {
            textAlign: 'center',
            font: '10pt helvetica, arial, sans-serif',
            stroke: '#333333',
            editable: true,
          },
          new go.Binding('text').makeTwoWay()
        )
      )
    )

    return diagram
  }
  const initPalette = () => {
    palette.nodeTemplateMap = templmap
    palette.model = new go.GraphLinksModel([
      // specify the contents of the Palette
      { category: 'Start', text: 'Start' },
      { text: 'Step' },
      { category: 'Conditional', text: '???' },
      { category: 'End', text: 'End' },
      { category: 'Comment', text: 'Comment' },
    ])
    return palette
  }
  return (
    <div className='   flex w-full h-full  '>
      <ReactPalette
        initPalette={initPalette}
        divClassName=' tools-diagram w-1/6 h-full relative  bg-blue-300 border-black border-solid border z-20'
        style={{ backgroundColor: '#f3f3f3' }}
      />
      <ReactDiagram
        ref={diagramRef}
        divClassName=' diagram-background w-5/6 h-full relative  bg-slate-100 border-black border-solid border'
        initDiagram={initDiagram}
        modelData={modelData}
        skipsDiagramUpdate={skipsDiagramUpdate}
        onModelChange={onModelChange}
      />
    </div>
  )
}
export default Wrapper
