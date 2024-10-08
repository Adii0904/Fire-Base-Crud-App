import { useEffect, useState } from "react";
import "remixicon/fonts/remixicon.css";
import Swal from "sweetalert2";
import firebaseConfigApp from "./lib/firebase-config";
import {
  getFirestore,
  addDoc,
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
const db = getFirestore(firebaseConfigApp);
const App = () => {
  const modal = {
    epmloyename: "",
    salary: "",
    joiningdate: "",
  };
  const [employe, setEmploye] = useState(modal);
  const [employeData, setEmployeData] = useState([]);
  const [isUpdated, setIsupdated] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [edit, setEdit] = useState(null);
  //firebase se data fetch karne ke liye hame getDocs method milta hain;
  useEffect(() => {
    console.log(employeData);

    const req = async () => {
      const snapshot = await getDocs(collection(db, "employees"));
      setIsEmpty(snapshot.empty);
      let tmp = [];
      snapshot.forEach((doc) => {
        const document = doc.data();
        document.uid = doc.id;
        tmp.push(document);
      });
      setEmployeData(tmp);
    };
    req();
  }, [isEmpty, isUpdated]);

  //this function for fetching the data from the 3 inputs feilds;
  const handleChange = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;

    setEmploye({
      ...employe,
      [name]: value,
    });
    // setEmploye((prev) => ({
    //   ...prev,
    //   [name]: value,
    // }));
  };

  const createEmploye = async (e) => {
    try {
      e.preventDefault();
      await addDoc(collection(db, "employees"), employe);
      setIsEmpty(false);
      setIsupdated(!isUpdated);
      new Swal({
        title: "Success",
        text: "Employee Added Successfully",
      });
    } catch (err) {
      console.log(err);

      new Swal({
        title: "Error",
        icon: "error",
        text: err.message,
      });
    } finally {
      setEmploye(modal);
    }
  };

  const deleteEmploye = async (id) => {
    const ref = doc(db, "employees", id);
    await deleteDoc(ref);
    setIsupdated(!isUpdated);
  };

  const editEmploye = (userData) => {
    setEdit(userData);
    setEmploye(userData);
  };

  const saveEmploye = async (e) => {
    e.preventDefault();
    const ref = doc(db, "employees", edit.uid);
    await updateDoc(ref, employe);
    setIsupdated(!isUpdated);
    setEdit(null);
    setEmploye(modal);
  };

  return (
    <div className="flex flex-col items-center gap-14">
      <h1 className="text-4xl font-bold">
        FireBase APP <span className="text-indigo-400">CRUD</span>
      </h1>
      <div className="flex w-11/12 gap-16">
        <form
          className="space-y-4"
          onSubmit={edit ? saveEmploye : createEmploye}
        >
          <div className="flex flex-col w-[400px]">
            <label className="font-semibold mb-2 text-lg">Employee Name</label>
            <input
              onChange={handleChange}
              type="text"
              name="epmloyename"
              value={employe.epmloyename}
              required
              className="p-2 rounded border border-gray-300"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold mb-2 text-lg">Salary</label>
            <input
              onChange={handleChange}
              type="number"
              name="salary"
              value={employe.salary}
              required
              className="p-2 rounded border border-gray-300"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold mb-2 text-lg">Joining Date</label>
            <input
              onChange={handleChange}
              type="date"
              name="joiningdate"
              value={employe.joiningdate}
              required
              className="p-2 rounded border border-gray-300"
            />
          </div>
          {/* 
          <button className="bg-green-400 px-4 py-2 font-semibold text-white rounded">
            Submit Data
          </button>
          <button className="bg-rose-400 px-4 py-2 font-semibold text-white rounded">
            Update Data
          </button> */}

          {edit ? (
            <button className="bg-green-400 px-4 py-2 font-semibold text-white rounded">
              SAVE
            </button>
          ) : (
            <button className="bg-rose-400 px-4 py-2 font-semibold text-white rounded">
              CREATE
            </button>
          )}
        </form>
        <div className="flex-1">
          {isEmpty && (
            <div className="flex flex-col items-center">
              <i className="ri-u-disk-line text-gray-500 text-3xl" />
              <h1 className="font-semibold text-4xl text-gray-500">Empty</h1>
            </div>
          )}
          <h1 className="text-3xl font-semibold">Employess</h1>
          <table className="w-full mt-8">
            <thead>
              <tr className="bg-rose-600 text-white text-left">
                <th className="pl-2 py-2">S.NO</th>
                <th>Employee Name</th>
                <th>Salary</th>
                <th>Joining Date</th>
                <th>actions</th>
              </tr>
            </thead>
            <tbody>
              {employeData.map((data, index) => {
                return (
                  <tr key={index} className="border-b border-gray-600">
                    <td className="pl-2 py-2">{index + 1}</td>
                    <td className="capitalize">{data.epmloyename}</td>
                    <td>₹{data.salary}</td>
                    <td>{data.joiningdate}</td>
                    <td>
                      <div className="space-x-2">
                        <button
                          className="w-8 h-8 bg-indigo-400 text-white rounded-full"
                          onClick={() => {
                            editEmploye(data);
                          }}
                        >
                          <i className="ri-file-edit-line" />
                        </button>
                        <button
                          className="w-8 h-8 bg-orange-400 text-white rounded-full"
                          onClick={() => {
                            deleteEmploye(data.uid);
                          }}
                        >
                          <i className="ri-delete-bin-6-line" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default App;

// day-44 32 delete cion id chahiye min
