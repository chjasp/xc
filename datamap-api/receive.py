import socket
import requests
from requests.structures import CaseInsensitiveDict
from injest import read_and_injest
import time
import schedule

dns_cache = {}
# Capture a dict of hostname and their IPs to override with
def override_dns(domain, ip):
    dns_cache[domain] = ip

prv_getaddrinfo = socket.getaddrinfo

# Override default socket.getaddrinfo() and pass ip instead of host if override is detected
def new_getaddrinfo(*args):
    if args[0] in dns_cache:
        print("Forcing FQDN: {} to IP: {}".format(args[0], dns_cache[args[0]]))
        return prv_getaddrinfo(dns_cache[args[0]], *args[1:])
    else:
        return prv_getaddrinfo(*args)

def datamap_api_call():
        socket.getaddrinfo = new_getaddrinfo
        override_dns('data-entw.intranet.commerzbank.com', '140.8.40.216')


        headers = CaseInsensitiveDict()
        headers["Accept"] = "text/csv"
        headers["Authorization"] = "Basic YXBpX2V4cG9ydGVyOmFwaV9leHBvcnRlcg=="
        headers["Content-Type"] = "text/csv"

        url = "https://data-entw.intranet.commerzbank.com/rest/dquantum/1.0/sql2chart/download?format=csv&filename=sqldl&query_key=dq_sensor_api_export&disable_query_timeout=true"
        r = requests.post(url, headers=headers, verify=False)
        print(r.content)

        dm_content = r.content
        csv_file = open('downloaded_sensors.csv', 'wb')
        csv_file.write(dm_content)

def complete_update():
        datamap_api_call()
        time.sleep(1)
        read_and_injest()
# Register a schedule ("when", "what")
schedule.every(50).seconds.do(complete_update)

# Check for any scheduled job
# Run scheduled job if existing
# Halt execution for x seconds
while True:
        schedule.run_pending()
        time.sleep(5)
        print("Checking ...")