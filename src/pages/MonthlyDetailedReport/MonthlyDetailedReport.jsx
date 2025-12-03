import YearMonthSelector from '../../components/YearMonthSelector/YearMonthSelector'
import DashboardLayout from '../../layouts/DashboardLayout'
import WorkingHoursDisplay from '../../components/WorkingHoursDisplay/WorkingHoursDisplay';
import SingleEmployeeView from '../../components/SingleEmployeeView/SingleEmployeeView';
import Card from '../../components/Card/Card';

function MonthlyDetailedReport() {
    
    const employee = {
    personnelNo: "EMP001",
    firstName: "John",
    lastName: "Doe",
    departmentNo: "D01",
    department: "IT"
  };
  return (
    <div>
        <DashboardLayout>
        <YearMonthSelector/>
        <div >
        <Card>
          <WorkingHoursDisplay />
          <SingleEmployeeView employee={employee} />
        </Card>
      </div>
        </DashboardLayout>
    </div>
  )
}

export default MonthlyDetailedReport