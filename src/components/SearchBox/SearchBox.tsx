import css from "./SearchBox.module.css";

interface SearchBoxProps {
  onSearch: (newQuery: string) => void;
  value: string;
}

export default function SearchBox({ onSearch, value }: SearchBoxProps) {
  return (
    <input
      defaultValue={value}
      onChange={(e) => onSearch(e.target.value)}
      className={css.input}
      type="text"
      placeholder="Search posts"
    />
  );
}
