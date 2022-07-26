import React, { useState, useRef } from 'react'

export default function DragNDrop({ data }) {
  const [list, setList] = useState(data)
  const [dragging, setDragging] = useState(false)

  const dragItem = useRef()
  const dragNode = useRef()

  const handleDragStart = (e, params) => {
    console.log('drag starting..', params)
    dragNode.current = e.target
    dragNode.current.addEventListener('dragend', handleDragEnd)
    dragItem.current = params
    setTimeout(() => {
      setDragging(true)
    }, 0)
  }

  const handleDragEnter = (e, params) => {
    console.log('entering drag', params)
    const currentItem = dragItem.current
    if (e.target !== dragNode.current) {
      console.log('target is not the same')
      setList((oldList) => {
        // deep copy of list
        let newList = JSON.parse(JSON.stringify(oldList))
        newList[params.grpI].items.splice(
          params.itemI,
          0,
          newList[currentItem.grpI].items.splice(currentItem.itemI, 1)[0]
        )
        dragItem.current = params
        return newList
      })
    }
  }

  const handleDragEnd = () => {
    setDragging(false)
    dragItem.current = null
    dragNode.current.removeEventListener('dragend', handleDragEnd)
    dragNode.current = null
  }

  const getStyles = (params) => {
    const currentItem = dragItem.current
    if (
      currentItem.grpI === params.grpI &&
      currentItem.itemI === params.itemI
    ) {
      return 'current dnd-item'
    }
    return 'dnd-item'
  }

  return (
    <div className="drag-n-drop">
      {list.map((grp, grpI) => (
        <div
          key={grp.title}
          className="dnd-group"
          onDragEnter={
            dragging && !grp.items.length
              ? (e) => handleDragEnter(e, { grpI, itemI: 0 })
              : null
          }
          onDragOver={(e) => e.preventDefault()}
        >
          <div key={grp.title} className="group-title">
            {grp.title}
          </div>
          {grp.items.map((item, itemI) => (
            <div
              draggable
              onDragOver={(e) => e.preventDefault()}
              onDragStart={(e) => {
                handleDragStart(e, { grpI, itemI })
              }}
              onDragEnter={
                dragging
                  ? (e) => {
                      handleDragEnter(e, { grpI, itemI })
                    }
                  : null
              }
              key={item}
              className={dragging ? getStyles({ grpI, itemI }) : 'dnd-item'}
            >
              {item}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
