INSERT INTO department (name)
VALUES ("Engineering"),
       ("Finance"),
       ("Legal"),
       ("Sales");



INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead",2500000.00,4),
       ("Salesperson",60000.00,4),
       ("Lead Engineer",170000.00,1),
       ("Software Engineer",128000.00,1),
       ("Account Manager",154000.00,2),
       ("Accountant",135000.00,2),
       ("Legal Team Lead",280000.00,3),
       ("Lawyer",180000.00,3);



INSERT INTO employee ( first_name, last_name, role_id, manager_id)
VALUES ("Parth","Mali",1,NULL),
       ( "Oliver","Tomiskaway",2,2),
       ( "Jeel","Gandhi",3,NULL),
       ( "John","Tate",4,3),
       ( "Romil","vyaas",5,NULL),
       ( "Ritesh","chauhan",6,5),
       ( "Keya","Upadhay",7,NULL),
       ( "Darshit","Rami",8,7);