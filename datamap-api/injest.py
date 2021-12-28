import csv
import mysql.connector

hostname = ''
username = ''
password = ''
database = ''

def read_and_injest():
        conn = mysql.connector.connect(host=hostname, user=username, passwd=password, db=database)
        cursor = conn.cursor()
        with open('downloaded_sensors.csv') as csvfile:
            filereader = csv.reader(csvfile, delimiter=',')
            for idx, row in enumerate(filereader):
                if (idx == 0):
                    continue
                # "Real" template
                # Here: update every sensor with datamap data
                # Also possible: Truncate (delete) table data completely and injest all rows from the csv
                """
                template = "UPDATE sensors \
                SET dqs_id=%s,dqs_name=%s,dqs_dimension=%s,dqs_type=%s,dqs_risk_type=%s,dqs_layer=%s,dqs_owner_group_division=%s,dqs_owner_division=%s,dqs_owner_division_head=%s,dqs_owner=%s,dqs_delivery_time=%s,dqs_delivery=%s,dqs_description=%s,dqs_measurement=%s,dqs_status_red=%s,dqs_status_amber=%s,dqs_valid_from=%s,dqs_valid_to=%s \
                WHERE dqs_id = %s"
                row.append(row[0])
                """
                # Demo template (injestion without deletion)
                template = "INSERT INTO sensors VALUES (%s,%s)"
                demorow = [row[1], row[2]]
                print("Injesting data: ", demorow)
                cursor.execute(template, demorow)

        print(cursor)
        conn.commit()
        conn.close()