import React from "react";
import { Pagination } from "react-bootstrap";

const PgHasNext = ({ currentPage, hasNextPage, onPageChange }) => {
  return (
    <Pagination className="justify-content-center mt-4">
      {/* Previous button */}
      <Pagination.Prev
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />

      {/* Current page */}
      <Pagination.Item active>{currentPage}</Pagination.Item>

      {/* Next page (if available) */}
      {hasNextPage && (
        <Pagination.Item onClick={() => onPageChange(currentPage + 1)}>
          {currentPage + 1}
        </Pagination.Item>
      )}

      {/* Next button */}
      <Pagination.Next
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
      />
    </Pagination>
  );
};

export default PgHasNext;
