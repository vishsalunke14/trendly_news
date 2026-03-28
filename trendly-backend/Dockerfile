FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copy ONLY backend folder
COPY trendly-backend /app

# Build jar
RUN chmod +x mvnw || true
RUN ./mvnw clean package -DskipTests || mvn clean package -DskipTests

# Run app
CMD ["sh", "-c", "java -jar target/*.jar"]