#
#
echo "------------------------------------------------------------------------------------------"
echo " "
echo " "
echo " "
echo " Restarting the ingress-nginx pod in the ingress-ngix namespace."
echo " "
echo " "
#
INGRESS_RESOURCE=ingress-nginx-controller
INGRESS_NS=ingress-nginx
#
echo " "
echo "Make sure the ingress-nginx  pods are running now."
kubectl get pods --namespace=ingress-nginx
#
echo " "
echo "make sure the LoadBalancer is running (EXTERNAL-IP) should say localhost!"
kubectl get services -n ingress-nginx 
#
echo " "
echo " Set run time variables with the deployment names"
echo " "
INGRESS_DEPL=`kubectl get pods --namespace=ingress-nginx | grep Running | awk '{print $1}'`;echo "INGRESS_DEPL: ${INGRESS_DEPL}"
NATS_DEPL=`kubectl get pods | grep nats-depl | awk '{print $1}'`;echo "NATS_DEPL: ${NATS_DEPL}"
#
echo " "
echo " "
echo " "
echo " Delete the ingress-nginx \"${INGRESS_DEPL}\" Pod in namespace \"${INGRESS_NS}\" now...."
echo " "
kubectl delete pod ${INGRESS_DEPL}  --namespace=${INGRESS_NS}
echo " "
echo " Pause for 5 seconds"
sleep 5
echo " "
echo " List Pods"
echo " "
kubectl get pods --namespace=${INGRESS_NS}
echo " "
echo " List Services"
echo " "
kubectl get services -n ${INGRESS_NS}
echo " "
echo " Display the configuration information"
echo " "
echo "kubectl describe ing" 
kubectl describe ing 
echo " "
echo "------------------------------------------------------------------------------------------"
