import { toast } from 'react-toastify';

class AttendanceService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'attendance';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { 
            field: { name: "student_id" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "date" } },
          { field: { Name: "status" } },
          { field: { Name: "reason" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ],
        orderBy: [
          {
            fieldName: "date",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching attendance:", error);
      toast.error("Failed to fetch attendance");
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { 
            field: { name: "student_id" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "date" } },
          { field: { Name: "status" } },
          { field: { Name: "reason" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching attendance with ID ${id}:`, error);
      toast.error("Failed to fetch attendance record");
      return null;
    }
  }

  async getByStudentId(studentId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { 
            field: { name: "student_id" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "date" } },
          { field: { Name: "status" } },
          { field: { Name: "reason" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ],
        where: [
          {
            FieldName: "student_id",
            Operator: "EqualTo",
            Values: [parseInt(studentId)]
          }
        ],
        orderBy: [
          {
            fieldName: "date",
            sorttype: "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching attendance by student ID:", error);
      toast.error("Failed to fetch student attendance");
      return [];
    }
  }

  async getByDate(date) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { 
            field: { name: "student_id" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "date" } },
          { field: { Name: "status" } },
          { field: { Name: "reason" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ],
        where: [
          {
            FieldName: "date",
            Operator: "EqualTo",
            Values: [date]
          }
        ],
        orderBy: [
          {
            fieldName: "student_id",
            sorttype: "ASC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching attendance by date:", error);
      toast.error("Failed to fetch attendance by date");
      return [];
    }
  }

  async create(attendanceData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Name: attendanceData.Name,
          student_id: parseInt(attendanceData.student_id),
          date: attendanceData.date,
          status: attendanceData.status,
          reason: attendanceData.reason || "",
          Tags: attendanceData.Tags || "",
          Owner: attendanceData.Owner
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success("Attendance record created successfully");
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating attendance:", error);
      toast.error("Failed to create attendance record");
      return null;
    }
  }

  async update(id, attendanceData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: attendanceData.Name,
          student_id: parseInt(attendanceData.student_id),
          date: attendanceData.date,
          status: attendanceData.status,
          reason: attendanceData.reason || "",
          Tags: attendanceData.Tags || "",
          Owner: attendanceData.Owner
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success("Attendance record updated successfully");
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating attendance:", error);
      toast.error("Failed to update attendance record");
      return null;
    }
  }

  async updateByStudentAndDate(studentId, date, status, reason = "") {
    try {
      // First check if record exists
      const existingRecords = await this.getByStudentAndDate(studentId, date);
      
      if (existingRecords.length > 0) {
        // Update existing record
        return await this.update(existingRecords[0].Id, {
          Name: existingRecords[0].Name,
          student_id: studentId,
          date: date,
          status: status,
          reason: reason,
          Tags: existingRecords[0].Tags,
          Owner: existingRecords[0].Owner
        });
      } else {
        // Create new record
        return await this.create({
          Name: `Attendance ${new Date(date).toLocaleDateString()}`,
          student_id: studentId,
          date: date,
          status: status,
          reason: reason
        });
      }
    } catch (error) {
      console.error("Error updating attendance by student and date:", error);
      toast.error("Failed to update attendance");
      return null;
    }
  }

  async getByStudentAndDate(studentId, date) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { 
            field: { name: "student_id" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "date" } },
          { field: { Name: "status" } },
          { field: { Name: "reason" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ],
        whereGroups: [
          {
            operator: "AND",
            subGroups: [
              {
                operator: "AND",
                conditions: [
                  {
                    fieldName: "student_id",
                    operator: "EqualTo",
                    values: [parseInt(studentId)]
                  },
                  {
                    fieldName: "date",
                    operator: "EqualTo",
                    values: [date]
                  }
                ]
              }
            ]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching attendance by student and date:", error);
      return [];
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success("Attendance record deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting attendance:", error);
      toast.error("Failed to delete attendance record");
      return false;
    }
  }
}

export const attendanceService = new AttendanceService();