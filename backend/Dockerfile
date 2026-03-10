FROM golang:1.25.7-alpine AS build

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 go build -o server ./cmd/server

FROM alpine:3.21

WORKDIR /app

COPY --from=build /app/server .
COPY --from=build /app/migrations/ ./migrations/

EXPOSE 8080

CMD ["./server"]
