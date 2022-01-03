clear
#
#
NATS_DEPL=`kubectl get pods | grep nats-depl | awk '{print $1}'`;echo "NATS_DEPL: ${NATS_DEPL}"
#
echo " "
echo "    Monitoring Doc: https://docs.nats.io/legacy/stan/intro/monitoring/endpoints "
echo " "
echo "    Monitoring View: http://localhost:8222/"
echo "                     http://localhost:8222/streaming/channelsz "
echo "                     http://localhost:8222/streaming/serverz"
echo " "
echo "                     http://localhost:8222/streaming/clientsz?limit=1&offset=1&subs=1"
echo " "
echo "Starting the port forwarder for the monitoring server now!"
echo " "
## kubectl port-forward ${NATS_DEPL} 4222:4222;     ## NATS streaming port
kubectl port-forward ${NATS_DEPL} 8222:8222;     ## NATS Monitoring port
