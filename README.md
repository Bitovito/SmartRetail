# SmartRetail
Plataforma de retail inteligente que ayuda a los consumidores a ahorrar dinero mientras toman decisiones de compra sostenibles, optimizando presupuesto e impacto ambiental.

## Requisitos Previos

- Docker
- Docker Compose

## Instalación y Ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/Bitovito/SmartRetail.git
cd SmartRetail
```

### 2. Construir y ejecutar los contenedores

```bash
docker compose up --build
```

Esto construirá las imágenes y levantará dos servicios:
- **Frontend**: React + Vite (puerto 5173)
- **Backend**: Django + DRF (puerto 8000)

### 3. Acceder a la aplicación

- **Frontend**: http://localhost:5173
- **API Backend**: http://localhost:8000/api/
- **Admin Django**: http://localhost:8000/admin

### 4. Cargar datos iniciales (opcional)

Para poblar la base de datos con los datos de prueba:

```bash
docker compose exec backend python manage.py loaddata initial_data.json
```

### Variables de Entorno

El proyecto requiere un archivo `.env` en la raíz con las siguientes variables:
- `DJANGO_SECRET_KEY`: Clave secreta de Django para encriptación
- `VITE_API_BASE`: URL del backend para el frontend
- `DEBUG`: Modo debug de Django (`True`/`False`)
- `ALLOWED_HOSTS`: Hosts permitidos (separados por comas)

### Algoritmos implementados

Se implementaron 2 algoritmos en este proyecto:
1. **Un algoritmo de optimización greedy:**
   Este algoritmo está implementado en el backend, en la view `optimize_cart`. Se escoge un producto de la misma categoría que cumpla con tener un menor coste, dando prioridad al coste economico por sobre al medioambiental. El motivo de esta desición es simple, dentro de los ordenes de prioridad de la gente, la seguridad y preservación propia va primero que el alturismo y el cuidado medioambiental, lo que no significa que se tenga que descuidar completamente.
2. **Un algoritmo de calsificación según valor nutricional vs impactio medioambiental:**
   Este algoritmo está implementado en el backend, en varios metodos dentro del modelo `Product`. El objetivo del algoritmo es obtener una calificación respecto a la sustentabilidad de cada producto, contrastando su valor nutricional (proteina y fibra - grasa y sodio) versus su impacto medioambiental (100 - CO2+agua+tierra utilizada). Se le da mayor peso al factor medioambiental, debido a que es una calificación de sustentabilidad; debe indicar que tan sostenible es producir ese alimento con tal de cuidar el medio ambiente.
   
### Uso de IA en el desarrollo

Durante el desarrollo de esta aplicación se utilizó el asistente inteligente Copilot de GitHub, integrado en el editor de codigop VScode. EL uso principal que se le dió a esta IA fue para consultas respecto a sintaxis y patrones de diseño especificos de los lenguajes y frameworks (TypeScript y Django) y para solución de errores emergentes (debugging). 
