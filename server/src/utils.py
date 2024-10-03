class obj:
    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

def dict_to_obj(d):
    return obj(**d)
