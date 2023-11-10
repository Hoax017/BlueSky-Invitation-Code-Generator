# BlueSky Invitation Code Generator

tested node version: v18.15.0, v20.8.0

```bash
node index.js
```

### normal print 
```
{
  error: 'InvalidInviteCode',
  message: 'Provided invite code not available'
}
Code: bsky-social-mal4c-ipa5d
Limite de taux: 4/100
Réinitialiser la limite de taux: 10/11/2023 18:12:19
}

```

### Headers

- ratelimit-limit: Cela indique le nombre maximum de requêtes que vous êtes autorisé à effectuer en une période donnée. Dans ce cas, la limite est fixée à 100 requêtes.
- ratelimit-policy: Cet en-tête spécifie la politique de limitation de taux. La valeur "100;w=300" indique que la limite est de 100 requêtes toutes les 300 secondes (ou 5 minutes).
- ratelimit-remaining: Il indique le nombre de requêtes restantes que vous pouvez effectuer avant d'atteindre la limite.
- ratelimit-reset: Cet en-tête donne le temps (en timestamp UNIX) auquel le compteur de limite de taux sera réinitialisé.