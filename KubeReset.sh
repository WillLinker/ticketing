#
#
cd /Users/willlinker/Visual.Code.Projects/training/ticketing
pwd
#
echo " "
echo "Install my Secerts"
echo " "
kubectl create secret generic jwt-secret --from-literal=jwt=asdf
kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=sk_test_51KDdnOKeCS85z8HQBBFM0J2cw23BOPZURWLXffW50508r6iWbtJHyI3alyncJudS50ADHLaLV9zO1gYfsKx3gyeh001rVZFUet
#
echo " "
echo " List secerts"
echo " "
kubectl get secrets
echo " "
echo "----------------------------------------------------------------"
kubectl describe secrets/jwt-secret
ehco " "
echo "----------------------------------------------------------------"
kubectl describe secrets/stripe-secret
ehco " "
echo "----------------------------------------------------------------"
#
# Installing ingress-nginx:  https://kubernetes.github.io/ingress-nginx/deploy/
echo " "
echo "Install ingress-nginx"
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.1.0/deploy/static/provider/cloud/deploy.yaml
# 
echo " "
echo "Pause for 10 seconds to let ingress-nginx start up"
sleep 10
echo " "
echo "Make sure the ingress-nginx  pods are running now."
kubectl get pods --namespace=ingress-nginx
#
echo " "
echo "make sure the LoadBalancer is running (EXTERNAL-IP) should say localhost!"
kubectl get services -n ingress-nginx 
#
INGRESS_DEPL=`kubectl get pods --namespace=ingress-nginx | grep Running | awk '{print $1}'`;echo "INGRESS_DEPL: ${INGRESS_DEPL}"
NATS_DEPL=`kubectl get pods | grep nats-depl | awk '{print $1}'`;echo "NATS_DEPL: ${NATS_DEPL}"
#
echo " "
echo "View the ingress-nginx logs"
kubectl logs ${INGRESS_DEPL} --namespace=ingress-nginx
echo " "
echo "If you are testing NATS from your localhost you may want to setup the Port-Forwarders"
echo " "
echo "# kubectl port-forward ${NATS_DEPL} 4222:4222;     ## NATS streaming port"
echo "# kubectl port-forward ${NATS_DEPL} 8222:8222;     ## NATS Monitoring port"
echo "    Monitoring View: http://localhost:8222/"
echo " "
echo " "
echo "You can use \"npm run test\" in folders to run test scripts."
echo " "
echo " "
echo "Pause for 10 seconds to let everything get started before launching \"skaffold dev\" up"
sleep 10
echo "Start skaffold dev back up now......"
skaffold dev
