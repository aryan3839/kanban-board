import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import "react-dropdown/style.css";
import { AiOutlineDown } from "react-icons/ai";
import { AiOutlineBars } from "react-icons/ai";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { AiOutlineDash } from "react-icons/ai";
import { TbAntennaBars5 } from "react-icons/tb";
import { TbAntennaBars4 } from "react-icons/tb";
import { TbAntennaBars3 } from "react-icons/tb";
import { TbProgress } from "react-icons/tb";
import { FaCircle } from "react-icons/fa";
import { FaRegCircle } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";
import { BsExclamationSquare } from "react-icons/bs";

const API_URL = "https://api.quicksell.co/v1/internal/frontend-assignment";

const App = () => {
  const [tickets, setTickets] = useState([]);
  const [groupingOption, setGroupingOption] = useState("status");
  const [sortingOption, setSortingOption] = useState("priority");
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      console.log(data["tickets"]);
      setTickets(data["tickets"]);
      setIsDataFetched(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleGroupingChange = (option) => {
    setGroupingOption(option);
  };

  const handleSortingChange = (option) => {
    setSortingOption(option);
  };
  const handleDisplayClick = () => {
    fetchData();
  };

  const groupAndSortTickets = () => {
    let groupedTickets = [...tickets];

    // Grouping
    if (groupingOption === "status") {
      groupedTickets.sort((a, b) => a.status.localeCompare(b.status));
    } else if (groupingOption === "user") {
      groupedTickets.sort((a, b) => a.assignee.localeCompare(b.assignee));
    } else if (groupingOption === "priority") {
      groupedTickets.sort((a, b) => a.priority - b.priority);
    }

    // Sorting
    if (sortingOption === "priority") {
      groupedTickets.sort((a, b) => b.priority - a.priority);
    } else if (sortingOption === "title") {
      groupedTickets.sort((a, b) => a.title.localeCompare(b.title));
    }

    return groupedTickets;
  };
  const renderColumns = () => {
    const groupedAndSortedTickets = groupAndSortTickets();
    const columns = {};

    // Group tickets by the selected grouping parameter
    groupedAndSortedTickets.forEach((ticket) => {
      let groupKey = ticket[groupingOption];
      let icon;

      // Convert status or priority values to human-readable strings and assign icons
      if (groupingOption === "status") {
        switch (ticket.status) {
          case "Todo":
            groupKey = "Todo";
            icon = <FaRegCircle />;
            break;
          case "In progress":
            groupKey = "In Progress";
            icon = <TbProgress />;
            break;
          case "Backlog":
            groupKey = "Backlog";
            icon = <RxCrossCircled />;
            break;
          default:
            groupKey = "Unknown";
            icon = null;
        }
      } else if (groupingOption === "priority") {
        switch (ticket.priority) {
          case 0:
            groupKey = "No priority";
            icon = <AiOutlineDash />;
            break;
          case 1:
            groupKey = "Low";
            icon = <TbAntennaBars3 />;
            break;
          case 2:
            groupKey = "Medium";
            icon = <TbAntennaBars4 />;
            break;
          case 3:
            groupKey = "High";
            icon = <TbAntennaBars5 />;
            break;
          case 4:
            groupKey = "Urgent";
            icon = (
              <FontAwesomeIcon
                icon={faExclamationCircle}
                style={{ color: "#fb4113" }}
              />
            );
            break;
          default:
            groupKey = "Unknown";
            icon = null;
        }
      }

      if (!columns[groupKey]) {
        columns[groupKey] = { tickets: [], count: 0, icon };
      }
      columns[groupKey].tickets.push(ticket);
      columns[groupKey].count += 1;
    });

    // Get all unique group keys
    const allGroupKeys = Object.keys(columns);

    if (groupingOption === "priority") {
      return (
        <div className="kanban-board">
          {allGroupKeys.map((groupKey) => (
            <div key={groupKey} className="column">
              <span className="icon">
                {columns[groupKey].icon}
                <span className="key">{groupKey}</span>
              </span>
              <span className="count">{columns[groupKey].count}</span>
              {columns[groupKey].tickets.map((ticket) => (
                <div key={ticket.id} className="ticket">
                  <span className="id1">{ticket.id}</span>
                  <span className="circle">
                    <FaCircle />
                  </span>
                  <div className="title1">{ticket.title}</div>
                  <span className="ex">
                    <BsExclamationSquare />
                  </span>
                  <span className="tag1">{ticket.tag}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div className="kanban-board">
          {allGroupKeys.map((groupKey) => (
            <div key={groupKey} className="column">
              <span className="grp1">
                <span className="icon1">
                  {columns[groupKey].icon}
                  <span className="key1">{groupKey}</span>
                </span>
                <span className="count1">{columns[groupKey].count}</span>
              </span>
              {columns[groupKey].tickets.map((ticket) => (
                <div key={ticket.id} className="ticket1">
                  <span className="id">{ticket.id}</span>
                  <span className="circle">
                    <FaCircle />
                  </span>
                  <div className="title">{ticket.title}</div>
                  <span className="ex">
                    <BsExclamationSquare />
                  </span>
                  <span className="tag">{ticket.tag}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    }
  };
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Click occurred outside the dropdown, close it
        setIsOpen(false);

        // Trigger your fetch action here
        handleDisplayClick();
        if (isDataFetched && renderColumns());
      }
    };

    // Attach the event listener
    document.addEventListener("click", handleDisplayClick);
    document.addEventListener("click", handleOutsideClick);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="all">
      <div className="dropdown" ref={dropdownRef}>
        <div className="tb">
          <div className="bars">
            <AiOutlineBars />
          </div>
          <text className="dis">Display</text>
          <div className="down" onClick={toggleDropdown}>
            <AiOutlineDown />
          </div>
        </div>
        {isOpen && (
          <ul Style={"list-style-type:none"} className="dropdown-list">
            <li>
              <div className="category">
                <label className="label">Grouping</label>
                <select
                  className="select"
                  onChange={(e) => handleGroupingChange(e.target.value)}
                >
                  <option value="status">Status</option>

                  <option value="priority">Priority</option>
                </select>
              </div>
            </li>
            <li>
              <div className="category">
                <label className="label">Ordering</label>
                <select
                  className="select1"
                  onChange={(e) => handleSortingChange(e.target.value)}
                >
                  <option value="priority">Priority</option>
                  <option value="title">Title</option>
                </select>
              </div>
            </li>
          </ul>
        )}
      </div>
      {isDataFetched && renderColumns()}
    </div>
  );
};

export default App;
