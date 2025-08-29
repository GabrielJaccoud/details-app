from app.database import Base, engine
from app.models import models
import sys

def create_tables():
    try:
        print("Criando tabelas...")
        Base.metadata.create_all(bind=engine)
        print("✅ Tabelas criadas com sucesso!")
        return True
    except Exception as e:
        print(f"❌ Erro ao criar tabelas: {e}")
        return False

def drop_tables():
    try:
        print("Removendo tabelas...")
        Base.metadata.drop_all(bind=engine)
        print("✅ Tabelas removidas!")
        return True
    except Exception as e:
        print(f"❌ Erro ao remover tabelas: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "drop":
        drop_tables()
    else:
        create_tables()


