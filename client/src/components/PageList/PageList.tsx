import "./PageList.css"
import React from "react"

interface PageListProps {
    pages: number[],
    setPageNumber: (pageIndex:number) => void,
    pageNumber: number
}

/*
Responsive navbar for site controls
*/
const PageList: React.FC<PageListProps> = (props) => {
    return (
        <div className="btn-page-wrapper">
        {props.pages.map((pageIndex:number) => {
          return (
            <button
              key={pageIndex}
              onClick={() => props.setPageNumber(pageIndex)}
              className={
                pageIndex === props.pageNumber ? "btn-page focus" : "btn-page"
              }
            >
              <span>{pageIndex + 1}</span>
            </button>
          );
        })}
      </div>
    )
}

export default PageList
