const schoolModel = require('../models/schoolModel');

class SchoolController {
  async register(req, res) {
    try {
      const { teacher, students } = req.body;
      
      if (!teacher || !Array.isArray(students) || students.length === 0) {
        return res.status(400).json({ message: 'Invalid request format' });
      }

      await schoolModel.registerStudents(teacher, students);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getCommonStudents(req, res) {
    try {
      const teachers = Array.isArray(req.query.teacher) ? 
        req.query.teacher : [req.query.teacher];
      
      if (!teachers || teachers.some(t => !t)) {
        return res.status(400).json({ message: 'Teacher parameter required' });
      }

      const students = await schoolModel.getCommonStudents(teachers);
      res.status(200).json({ students });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async suspend(req, res) {
    try {
      const { student } = req.body;
      
      if (!student) {
        return res.status(400).json({ message: 'Student email required' });
      }

      const success = await schoolModel.suspendStudent(student);
      if (!success) {
        return res.status(404).json({ message: 'Student not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async retrieveForNotifications(req, res) {
    try {
      const { teacher, notification } = req.body;
      
      if (!teacher || !notification) {
        return res.status(400).json({ message: 'Teacher and notification required' });
      }

      const recipients = await schoolModel.getNotificationRecipients(teacher, notification);
      res.status(200).json({ recipients });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = new SchoolController();