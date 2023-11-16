import { ComponentProps, forwardRef } from "react";

interface Props {
  name: string;
  headers: string[];
  content: string[];
}

const Table = forwardRef<HTMLTableElement, Props & ComponentProps<"table">>(
  ({ content, headers, name, ...rest }, ref) => {
    return (
      <table ref={ref} {...rest}>
        <thead>
          <tr>
            {headers.map((header) => (
              <th
                className="border border-slate-600"
                key={`table-${name}-header-${header}`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {content.map((row, idx) => (
            <tr key={`table-${name}-row-${idx}`}>
              {Object.values(row).map((cell, cIdx) => (
                <td
                  className="border border-slate-700"
                  key={`table-${name}-row-${idx}-cell-${cIdx}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
);

export default Table;
