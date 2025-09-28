# Impermanents : Atelier de programmation du 28 septembre 2025
Projet web collaboratif explorant les thèmes de l’impermanence dans un contexte d’abondance numérique.

## Objectif
Développer une application prototype pour un doctorant du nouveau département de design de l’ÉTS, dans une réflexion sur notre relation à l’art et à la musique par la technologie.

## Concept
Un simple CMS qui génère un code QR donnant droit à **une seule écoute** d’une chanson, accompagnée de ses paroles et d’un message de l’artiste.

Le QR code généré permet une seule écoute par dispositif. Une autre personne pourrait le scanner pour l’écouter (ça fait partie de l’intention, trouver des moments d’écoute individuel ou collectif signifiants).

## Contexte théorique
Si vous souhaitez en savoir plus sur les théories qui sous-tendent ce projet (explorées dans le cadre de ma thèse)...
Elles s’appuient sur les théories critiques des industries culturelles et sur la théorie de la résonance du sociologue allemand Hartmut Rosa :  
<https://en.wikipedia.org/wiki/Resonance_(sociology)>

## Tâches de l’atelier
- Coder le **front-end** et le **back-end**  
- Déployer le tout sur notre infrastructure dans le cluster sandbox: impermanents-<equipe>.prodv2.cedille.club

## Documentation: Frontend

Les informations qui suivent sont des guides. Si vous désirer faire autrement allez y!

Les vues à faire sont montré dans un pdf : [View the PDF](https://github.com/ClubCedille/impermanent/blob/main/impermanent_views.pdf)

Un petit MDD diagramme (en UML) qui illustre les composantes. [View the UML](https://github.com/ClubCedille/impermanent/blob/main/impermanents_uml_mdd.pdf)
 
## Documentaiton: Backend



## Documentation: Déploiement (Kubernetes)

- Installer Krew dans votre terminal: suivre [les instructions d'installation de
krew](https://krew.sigs.k8s.io/docs/user-guide/setup/install/)

- **kubelogin**

`kubelogin` est utilisé pour s'authentifier au cluster sandbox pour cet atelier en utilisant le SSO avec OIDC.

Pour installer `kubelogin`, exécuter la commande :


```bash
kubectl krew install oidc-login
```

Pour d'autres options d'installation, voir [le repo de
kubelogin](https://github.com/int128/kubelogin)

- Récupérer le fichier de configuration envoyé par courriel si vous vous êtes inscrit à l'atelier, sinon demander à Alex de vous l'envoyer.

- Modifier dans le fichier k8s-sandbox-config.yaml les deux lignes où vous devez mettre votre courriel étudiant de l'ETS <your-email>.

- Indiquer à kubectl où se situe le fichier de configuration.

Avec Linux/MacOS:

```bash
export KUBECONFIG=~/Downloads/k8s-sandbox-config.yaml #Modifier selon l'emplacement du kubeconfig téléchargé
kubectl get nodes
```

Avec Windows: 

```bash
kubectl oidc-login
$env:KUBECONFIG="C:\Users\<user>\Downloads\k8s-sandbox-config.yaml" #Modifier selon l'emplacement du kubeconfig téléchargé
kubectl get nodes
```

Vous devriez être redirigé vers une page d'authentification de Omni pour vous authentifier.
(Si cela ne vous redirige pas vers une page de connexion dans votre navigateur, vérifier qu'il n'y a pas de fautes de frappe.)

- Dans la page de connexion, cliquer sur Créer un compte Omni.
Saisir le même courriel et un mot de passe.

- Vérifier votre courriel en cliquant sur le lien reçu par email.

- Ensuite, vous pouvez refaire la commande et vous devriez voir ceci :

```bash
kubectl get nodes

#(objectpath '/org/freedesktop/portal/desktop/request/1_192/t',)
#NAME                                 STATUS   ROLES           AGE    VERSION
#k8s-cedille-sandbox-controlplane-0   Ready    control-plane   3d3h   v1.30.0
#k8s-cedille-sandbox-worker-0                Ready    <none>          3d3h   v1.30.0
#k8s-cedille-sandbox-worker-1                Ready    <none>          3d3h   v1.30.0
#k8s-cedille-sandbox-worker-2                Ready    <none>          3d3h   v1.30.0
``` 
