// import React, { useState, useEffect, useRef, useCallback } from 'react';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './tableComponent.css';
import { IconSearch, IconChevron, IconSort, getIconComponent } from './tableIcons';
// import { DEFAULT_ROWS, DEFAULT_COLUMNS } from '../tableDataStructure/demoTablesData.jsx';
import { DEFAULT_ROWS, DEFAULT_COLUMNS } from '../../tableDataStructure/demoTablesData.jsx';

const TableComponent = ({
  data = DEFAULT_ROWS,
  columns = DEFAULT_COLUMNS,
  detailExtra = [],
  pageSize = 8,
  searchable = true,
  searchPlaceholder = 'Search team…',
  dateFilterable = true,
  dateKey = 'joined',
  defaultSort = { key: 'name', dir: 'asc' },
  rowIdKey = 'id',
  title = 'Team directory',
  description = 'Resize the browser — columns collapse into the expandable row',
}) => {
  const containerRef = useRef(null);

  // State
  const [query, setQuery] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [sortKey, setSortKey] = useState(defaultSort?.key || null);
  const [sortDir, setSortDir] = useState(defaultSort?.dir || 'asc');
  const [page, setPage] = useState(1);
  const [openChildRows, setOpenChildRows] = useState(new Set());
  const [visibleKeys, setVisibleKeys] = useState(columns.map((c) => c.key));

  // const controlWidth = 46;
  // const cellPaddingBuffer = 32;

  // const normalizedColumns = columns.map((c, i) => ({
  //   sortable: false,
  //   minWidth: 100,
  //   priority: 5,
  //   ...c,
  //   _index: i,
  // }));

  const controlWidth = 46;
  const cellPaddingBuffer = 32;

  const normalizedColumns = useMemo(
    () =>
      columns.map((c, i) => ({
        sortable: false,
        minWidth: 100,
        priority: 5,
        ...c,
        _index: i,
      })),
    [columns]
  );

  // Recalculate column visibility dynamically accounting for padding buffers
  const recalcVisibility = useCallback(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    if (!width) return;

    const sortedByPriority = [...normalizedColumns].sort((a, b) => a.priority - b.priority);
    let visibleSet = new Set(normalizedColumns.map((c) => c.key));

    const getTotalWidth = (hasCtrl) =>
      (hasCtrl ? controlWidth : 0) +
      sortedByPriority
        .filter((c) => visibleSet.has(c.key))
        .reduce((sum, c) => sum + (c.minWidth || 100) + cellPaddingBuffer, 0);

    while (visibleSet.size > 1) {
      const willHaveControl = visibleSet.size < normalizedColumns.length || detailExtra.length > 0;
      if (getTotalWidth(willHaveControl) <= width) {
        break;
      }
      const lowestPriorityCol = sortedByPriority
        .filter((c) => visibleSet.has(c.key))
        .sort((a, b) => b.priority - a.priority)[0];

      if (!lowestPriorityCol) break;
      visibleSet.delete(lowestPriorityCol.key);
    }

  //   setVisibleKeys(normalizedColumns.filter((c) => visibleSet.has(c.key)).map((c) => c.key));
  // }, [normalizedColumns, detailExtra]);
  setVisibleKeys(normalizedColumns.filter((c) => visibleSet.has(c.key)).map((c) => c.key));
  }, [normalizedColumns, detailExtra.length]);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(() => {
      recalcVisibility();
    });

    observer.observe(containerRef.current);
    recalcVisibility();

    return () => observer.disconnect();
  }, [recalcVisibility]);

  // Handlers
  const handleSearchChange = (e) => {
    setQuery(e.target.value.toLowerCase());
    setPage(1);
  };

  const handleSort = (col) => {
    if (!col.sortable) return;
    if (sortKey === col.key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(col.key);
      setSortDir('asc');
    }
  };

  const toggleRowOpen = (rowKey) => {
    setOpenChildRows((prev) => {
      if (prev.has(rowKey)) {
        return new Set();
      }
      return new Set([rowKey]);
    });
  };

  // Filter & Sort
  const visibleCols = normalizedColumns.filter((c) => visibleKeys.includes(c.key));
  const hiddenCols = normalizedColumns.filter((c) => !visibleKeys.includes(c.key));
  const showControl = hiddenCols.length > 0 || detailExtra.length > 0;

  const getProcessedData = () => {
    let result = data || [];

    if (query) {
      result = result.filter((row) =>
        normalizedColumns.some((col) => {
          const val = row[col.key];
          return val !== undefined && val !== null && String(val).toLowerCase().includes(query);
        })
      );
    }

    if (dateFilterable && (fromDate || toDate)) {
      result = result.filter((row) => {
        const rawDate = row[dateKey] || row.joined || row.joinDate || row.lastActive;
        if (!rawDate) return true;
        const rowTime = new Date(rawDate).getTime();
        if (isNaN(rowTime)) return true;

        if (fromDate) {
          const fromTime = new Date(fromDate).getTime();
          if (rowTime < fromTime) return false;
        }

        if (toDate) {
          const toTime = new Date(toDate + 'T23:59:59').getTime();
          if (rowTime > toTime) return false;
        }

        return true;
      });
    }

    if (sortKey) {
      const dirMultiplier = sortDir === 'desc' ? -1 : 1;
      result = [...result].sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        if (av === bv) return 0;
        if (av === undefined || av === null) return 1;
        if (bv === undefined || bv === null) return -1;
        return (av > bv ? 1 : -1) * dirMultiplier;
      });
    }

    return result;
  };

  const processedData = getProcessedData();
  const totalPages = Math.max(1, Math.ceil(processedData.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * pageSize;
  const pageRows = processedData.slice(startIdx, startIdx + pageSize);

  const renderCellContent = (col, row) => {
    const val = row[col.key];
    if (col.render) {
      return col.render(val, row);
    }
    return val !== undefined && val !== null ? val : '';
  };

  const startEntry = processedData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endEntry = Math.min(processedData.length, currentPage * pageSize);

  const renderPaginationButtons = () => {
    const buttons = [];
    for (let p = 1; p <= totalPages; p++) {
      if (totalPages > 7 && p !== 1 && p !== totalPages && Math.abs(p - currentPage) > 1) {
        if (p === 2 || p === totalPages - 1) {
          buttons.push(
            <span key={`ellipsis-${p}`} className="dt-page-ellipsis">
              …
            </span>
          );
        }
        continue;
      }

      buttons.push(
        <button
          key={p}
          className={`dt-page-btn ${p === currentPage ? 'current' : ''}`}
          onClick={() => setPage(p)}
        >
          {p}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className="wrap">
      <div className="panel">
        <div className="panel-head">
          <div className="panel-head-info">
            {title && (
              <h1>
                {title}
                <span className="panel-head-badge">{processedData.length} records</span>
              </h1>
            )}
            {description && <p>{description}</p>}
          </div>

          <div className="dt-toolbar">
            {dateFilterable && (
              <div className="dt-date-filter">
                <div className="dt-date-input-group">
                  <span className="dt-date-label">From:</span>
                  <input
                    type="date"
                    className="dt-date-input"
                    value={fromDate}
                    onChange={(e) => {
                      setFromDate(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>
                <div className="dt-date-input-group">
                  <span className="dt-date-label">To:</span>
                  <input
                    type="date"
                    className="dt-date-input"
                    value={toDate}
                    onChange={(e) => {
                      setToDate(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>
                {(fromDate || toDate) && (
                  <button
                    className="dt-date-clear"
                    onClick={() => {
                      setFromDate('');
                      setToDate('');
                      setPage(1);
                    }}
                    title="Reset date filter"
                  >
                    Reset Dates ✕
                  </button>
                )}
              </div>
            )}

            {searchable && (
              <div className="dt-search">
                <IconSearch />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={query}
                  onChange={handleSearchChange}
                />
                {query && (
                  <button
                    className="dt-search-clear"
                    onClick={() => setQuery('')}
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="panel-body">
          <div className="dt-root" ref={containerRef}>

            <div className="dt-scroll">
              <table className="dt-table">
                <thead>
                  <tr>
                    {showControl && <th className="dt-control-col"></th>}
                    {visibleCols.map((c) => {
                      const isActiveSort = sortKey === c.key;
                      return (
                        <th
                          key={c.key}
                          className={c.sortable ? 'dt-sortable' : ''}
                          onClick={() => handleSort(c)}
                        >
                          {c.label}
                          {c.sortable && (
                            <span className={`dt-sort ${isActiveSort ? `active ${sortDir}` : ''}`}>
                              <IconSort />
                            </span>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {pageRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={visibleCols.length + (showControl ? 1 : 0)}
                        className="dt-empty"
                      >
                        No matching records found
                      </td>
                    </tr>
                  ) : (
                    pageRows.map((row, index) => {
                      const rowKey = rowIdKey && row[rowIdKey] !== undefined ? row[rowIdKey] : index;
                      const isOpen = showControl && openChildRows.has(rowKey);

                      const tiles = [
                        ...hiddenCols.map((c) => ({
                          label: c.label,
                          icon: c.icon,
                          value: renderCellContent(c, row),
                        })),
                        ...detailExtra.map((d) => ({
                          label: d.label,
                          icon: d.icon,
                          value: d.render ? d.render(row) : row[d.key],
                        })),
                      ];

                      return (
                        <React.Fragment key={rowKey}>
                          <tr className={`dt-row ${isOpen ? 'dt-row-open' : ''}`}>
                            {showControl && (
                              <td
                                className={`dt-control-col dt-control ${isOpen ? 'open' : ''}`}
                                onClick={() => toggleRowOpen(rowKey)}
                              >
                                <span className="dt-play-btn">
                                  <IconChevron />
                                </span>
                              </td>
                            )}
                            {visibleCols.map((c) => (
                              <td key={c.key}>{renderCellContent(c, row)}</td>
                            ))}
                          </tr>

                          {showControl && isOpen && (
                            <tr className="dt-child-row">
                              <td colSpan={visibleCols.length + 1}>
                                <div className="dt-card-grid">
                                  {tiles.map((tile, i) => (
                                    <div key={i} className="dt-card-tile">
                                      {tile.icon && getIconComponent(tile.icon)}
                                      <div>
                                        <div className="dt-card-label">{tile.label}</div>
                                        <div className="dt-card-value">{tile.value}</div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="dt-footer">
              <div className="dt-info">
                Showing {startEntry}–{endEntry} of {processedData.length} entries
              </div>
              <div className="dt-pagination">
                <button
                  className="dt-page-btn"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                {renderPaginationButtons()}
                <button
                  className="dt-page-btn"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableComponent;